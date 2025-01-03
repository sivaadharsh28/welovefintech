const xrpl = require("xrpl");
const cc = require('five-bells-condition');
const crypto = require('crypto');
const dotenv = require("dotenv");
dotenv.config();

const SEED = process.env.SEED;

//run when user requests new flight insurance
const newFlightInsurance = async (req, res) => {
    let body = req.body;
    let user = body["user"];
    let flight = body["flight"];

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

        // Set the escrow finish time ---------------------------------------------
        let finishAfter = new Date((new Date().getTime() / 1000) + 120); // 2 minutes from now
        finishAfter = new Date(finishAfter * 1000);
        console.log("This escrow will finish after: ", finishAfter);

    } catch (error) {
        console.log(error);
    }

}

module.exports = {newFlightInsurance}