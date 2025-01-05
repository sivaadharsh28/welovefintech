const xrpl = require("xrpl");
const cc = require('five-bells-condition');
const crypto = require('crypto');
const { savePendingFlightInsurance, deleteFlightInsurance } = require("../misc/mongoose");

const SEED = process.env.SEED;

//run when user requests new flight insurance
const newFlightInsurance = async (req, res) => {
    let body = req.body;
    let user = body["user"]; //user xrpl account and other details
    let flight = body["flight"]; //flight data

    /* 
    Example data format

    flight = {
        code = 'SQ267',
        departure = '2019-12-12T04:20:00+00:00'
        arrival = '2019-12-12T04:20:00+00:00'
        ...
        ...
    }

    user = {
        address = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
    }
    
    */

    try {
        const preimageData = crypto.randomBytes(32);
        const fulfillment = new cc.PreimageSha256();
        fulfillment.setPreimage(preimageData);
        const fulfillmentHex = fulfillment.serializeBinary().toString('hex').toUpperCase();
        const conditionHex = fulfillment.getConditionBinary().toString('hex').toUpperCase();

        // Connect ----------------------------------------------------------------
        const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
        await client.connect();

        // Prepare wallet to sign the transaction ---------------------------------
        const wallet = await xrpl.Wallet.fromSeed(SEED);

        // Set the escrow cancel time ---------------------------------------------
        let cancelAfter = new Date(flight['arrival']); // Cancel 1 day after arrival
        cancelAfter.setDate(cancelAfter.getDate() + 1);
        let finishAfter = new Date(flight["arrival"]); // Only finish after scheduled arrival

        const escrowCreateTransaction = {
            "TransactionType": "EscrowCreate",
            "Account": wallet.address,
            "Destination": user["address"],
            "Amount": "6000000", //drops XRP, equals 6XRP
            "DestinationTag": 2023,
            "Condition": conditionHex,
            "Fee": "12",
            "CancelAfter": xrpl.isoTimeToRippleTime(cancelAfter.toISOString()),
            "FinishAfter": xrpl.isoTimeToRippleTime(finishAfter.toISOString())
        };
      
        xrpl.validate(escrowCreateTransaction);
      
        // Sign and submit the transaction ----------------------------------------
        const response  = await client.submitAndWait(escrowCreateTransaction, { wallet });
        const offerSequence = response.result.tx_json.Sequence;
        console.log(offerSequence);
      
        await client.disconnect();

        //Save claim to mongo
        const fieldsJson = {
            "flightCode": flight["code"],
            "departure": flight["departure"],
            "arrival": flight["arrival"],
            "offerSequence": offerSequence,
            "condition": conditionHex,
            "fulfillment": fulfillmentHex
        }
        await savePendingFlightInsurance(fieldsJson);

        res.status(200).json(response);

    } catch (e) {
        console.log(e);
        res.status(400).json({error: e.message});
    }

}

const makePayout = async (req, res) => {
    const body = req.body;
    const offerSequence = body["offerSequence"];
    const condition = body["condition"];
    const fulfillment = body["fulfillment"];

    try {
        // Connect ----------------------------------------------------------------
        const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
        await client.connect();

        // Prepare wallet to sign the transaction ---------------------------------
        const wallet = await xrpl.Wallet.fromSeed(SEED);

        const escrowFinishTransaction = {
            "Account": wallet.address,
            "TransactionType": "EscrowFinish",
            "Owner": wallet.address,
            "OfferSequence": offerSequence,
            "Condition": condition,
            "Fulfillment": fulfillment
        }

        xrpl.validate(escrowFinishTransaction);

        // Sign and submit the transaction ----------------------------------------
        const response  = await client.submitAndWait(escrowFinishTransaction, { wallet });
        await client.disconnect();

        // Delete corresponding document from MongoAtlas
        await deleteFlightInsurance(condition);

        res.status(200).json(response);
    } catch (e) {
        console.log(e);
        res.status(400).json({error: e.message});
    }
}

module.exports = { newFlightInsurance, makePayout };