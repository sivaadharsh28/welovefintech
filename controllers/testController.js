const { Web3 } = require("web3");
const fs = require("fs");
const { getFlightData } = require("../misc/queryFlight");

const RPC_URL =  "https://rpc-evm-sidechain.xrpl.org";
const CONTRACT_ADDRESS = "0x487d798dB8D860C6C48fc9bA17A2Ef701941f16d";

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

const fundContract = async (req, res) => {
    try {
        const body = req.body;
        const amount = parseInt(body["amount"]);

        const web3 = new Web3(RPC_URL);
        const xrpAddress = "0xD4949664cD82660AaE99bEdc034a0deA8A0bd517";
        const xrp_abi = JSON.parse(fs.readFileSync("./misc/abi/xrp_abi.json"));
        const sender = web3.eth.accounts.wallet.add(process.env.COMPANY_WALLET_SECRET)[0];

        //Handle xrp spending approval
        const xrpToken = new web3.eth.Contract(xrp_abi, xrpAddress);
        const approval = await xrpToken.methods.approve(CONTRACT_ADDRESS, amount * 10 ** 18).send({from: sender.address});
        console.log(approval);
        
        const abi = JSON.parse(fs.readFileSync("./misc/abi/contract_abi.json"));
        const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
        const receipt = await contract.methods.depositXRP(amount * 10 ** 18).send({from: sender.address});
        console.log(receipt);
        res.status(200).json({"message": "Smart Contract funded"});

    } catch (e) {
        console.log(e);
        res.status(400).json({"error": e});
    }
}

const executeContract = async (req, res) => {
    try {
        const body = req.body;
        const tier = parseInt(body["insuranceTier"]);
        const userWallet = body["userWallet"];

        const web3 = new Web3(RPC_URL);
        const sender = web3.eth.accounts.wallet.add(process.env.COMPANY_WALLET_SECRET)[0];
        const abi = JSON.parse(fs.readFileSync("./misc/abi/contract_abi.json"));
        const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
        const receipt = await contract.methods.initiatePayout(tier, userWallet).send({from: sender.address});

        console.log(receipt);
        res.status(200).json({"message":"Contract executed successfully"});
    } catch (e) {
        console.log(e);
        res.status(400).json({"error": e.message});
    }
    
}

module.exports = { testQueryFlight, fundContract, executeContract };