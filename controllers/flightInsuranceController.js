const fs = require("fs");
const {Web3} = require("web3");
const { savePendingFlightInsurance, deleteFlightInsurance } = require("../misc/mongoose");

const RPC_URL =  "https://rpc-evm-sidechain.xrpl.org";
const CONTRACT_ADDRESS = "0x487d798dB8D860C6C48fc9bA17A2Ef701941f16d";

//run when user requests new flight insurance
const newFlightInsurance = async (req, res) => {
    let body = req.body;
    let user = body["user"]; //user xrpl account and other details
    let flight = body["flight"]; //flight data

    /* 
    Example data format

    flight = {
        code = 'SQ267',
        departure = '2019-12-12'
        arrival = '2019-12-12'
        ...
        ...
    }

    user = {
        address = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
    }
    
    */

    try {
        //Save claim to mongo
        const fieldsJson = {
            "userID": user["userID"],
            "flightCode": flight["code"],
            "departure": flight["departure"],
            "arrival": flight["arrival"],
        }
        await savePendingFlightInsurance(fieldsJson);

        res.status(200).json({message: "Insurance created succesfully"});

    } catch (e) {
        console.log(e);
        res.status(400).json({error: e.message});
    }

}

const fundSmartContract = async (amount) => {
    try {
        const web3 = new Web3(RPC_URL);
        const xrpAddress = "0xD4949664cD82660AaE99bEdc034a0deA8A0bd517";
        const xrp_abi = JSON.parse(fs.readFileSync("./misc/xrp_abi.json"));
        //const sender = web3.eth.accounts.privateKeyToAccount(process.env.COMPANY_WALLET_SECRET);
        const sender = web3.eth.accounts.wallet.add(process.env.COMPANY_WALLET_SECRET)[0];

        //Handle xrp spending approval
        const xrpToken = new web3.eth.Contract(xrp_abi, xrpAddress);
        const approval = await xrpToken.methods.approve(CONTRACT_ADDRESS, amount * 10 ** 18).send({from: sender.address});
        console.log(approval);
        
        const abi = JSON.parse(fs.readFileSync("./misc/abi.json"));
        const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
        const receipt = await contract.methods.depositXRP(amount * 10 ** 18).send({from: sender.address});
        console.log(receipt);
    } catch (e) {
        console.log(e);
    }
    
}

const executeSmartContract = async () => {
    const tier = 0;
    const customerWallet = "0xE2B3EaDC7DEE01763707e3E982329178C6cF18dD";
    
    const web3 = new Web3(RPC_URL);
    const sender = web3.eth.accounts.wallet.add(process.env.COMPANY_WALLET_SECRET)[0];
    const abi = JSON.parse(fs.readFileSync("./misc/abi.json"));
    const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
    const receipt = await contract.methods.initiatePayout(tier, customerWallet).send({from: sender.address});
    console.log(receipt);
}

module.exports = { newFlightInsurance, executeSmartContract, fundSmartContract };