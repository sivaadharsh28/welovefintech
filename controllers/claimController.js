const xrpl = require("xrpl");
const cc = require('five-bells-condition');
const crypto = require('crypto');

const SEED = process.env.SEED;

//run when user requests new flight insurance
const newFlightInsurance = async (req, res) => {
    let body = req.body;
    let user = body["user"]; //user xrpl account and other details
    let flight = body["flight"]; //flight data

    /* 
    Example flight data

    flight = {
        code = 'SQ267',
        departure = '2019-12-12T04:20:00+00:00'
        arrival = '2019-12-12T04:20:00+00:00'
        ...
        ...
    }
    
    */

    //some function to validate user and flight here

    try {
        const preimageData = crypto.randomBytes(32);
        const fulfillment = new cc.PreimageSha256();
        fulfillment.setPreimage(preimageData);
        const conditionHex = fulfillment.getConditionBinary().toString('hex').toUpperCase();
        console.log('Condition:', conditionHex);
        console.log('Fulfillment:', fulfillment.serializeBinary().toString('hex').toUpperCase());

        // Connect ----------------------------------------------------------------
        const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
        await client.connect();

        // Prepare wallet to sign the transaction ---------------------------------
        const wallet = await xrpl.Wallet.fromSeed(SEED);
        console.log("Wallet Address: ", wallet.address);
        console.log("Seed: ", SEED);

        // Set the escrow cancel time ---------------------------------------------
        let cancelAfter = new Date(flight['arrival']); // Cancel 1 day after arrival
        cancelAfter.setDate(cancelAfter.getDate() + 1);
        console.log("This escrow will cancel after: ", cancelAfter);

        const escrowCreateTransaction = {
            "TransactionType": "EscrowCreate",
            "Account": wallet.address,
            "Destination": userWallet.address,
            "Amount": "6000000", //drops XRP
            "DestinationTag": 2023,
            "Condition": conditionHex,
            "Fee": "12",
            "CancelAfter": xrpl.isoTimeToRippleTime(cancelAfter.toISOString()),
        };
      
          xrpl.validate(escrowCreateTransaction);
      
          // Sign and submit the transaction ----------------------------------------
          console.log('Signing and submitting the transaction:',
                      JSON.stringify(escrowCreateTransaction, null,  "\t"), "\n"
          );
          const response  = await client.submitAndWait(escrowCreateTransaction, { wallet });
          console.log(`Sequence number: ${response.result.tx_json.Sequence}`);
          console.log(`Finished submitting! ${JSON.stringify(response.result, null, "\t")}`);
      
          await client.disconnect();

    } catch (error) {
        console.log(error);
    }

}

module.exports = {newFlightInsurance}