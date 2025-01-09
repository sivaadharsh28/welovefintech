const { getFlightData } = require("../misc/queryFlight");
const { fundContract, executeContract } = require("../misc/smartContract");

// NOTE: For testing purposes ONLY

const testQueryFlight = async (req, res) => {
    try {
        const body = req.body;
        let flightCode = body["flightCode"];
        let departureDate = body["departureDate"];

        const result = await getFlightData(flightCode, departureDate);

        res.status(200).json(result);
    } catch (e) {
        res.status(400).json({error: e.message});
    }

}

const callFundContract = async (req, res) => {
    try {
        const body = req.body;
        const amount = parseInt(body["amount"]);
        await fundContract(amount);
        res.status(200).json({"message":"Smart Contract funding successful"});

    } catch (e) {
        console.log(e);
        res.status(400).json({"error": e});
    }
}

const callExecuteContract = async (req, res) => {
    try {
        const body = req.body;
        const tier = parseInt(body["insuranceTier"]);
        const userWallet = body["userWallet"];

        await executeContract(tier, userWallet);
        res.status(200).json({"message":"Contract executed successfully"});
    } catch (e) {
        console.log(e);
        res.status(400).json({"error": e.message});
    }
    
}

module.exports = { testQueryFlight, callFundContract, callExecuteContract };