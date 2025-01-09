const xrpl = require("xrpl");
const ethers = require("ethers");
const fs = require("fs");
const AxelarExecutableWithToken = require("@axelar-network/axelar-gmp-sdk-solidity/interfaces/IAxelarExecutableWithToken.json");
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

const executeSmartContract = async (req, res) => {
    const body = req.body;
    const RPC_URL =  "https://rpc-evm-sidechain.xrpl.org";
    const CONTRACT_ADDRESS = "779194bC0Ff46977afEFE2F8291aFde32D182CC1";
    const ABI = JSON.parse(fs.readFileSync("../misc/abi.json", "utf-8"));

    const client = new xrpl.Client("wss://s.devnet.rippletest.net:51233");
    await client.connect();
    const wallet = xrpl.Wallet.fromSeed(process.env.SECRET);

    // hard coded values for testing
    const insuranceTier = 0;
    const userWalletAddress = "r4jtkmSMabVLAGovzBY1qaT3uzhewG9ooX";
    const encodedPayload = ethers.utils.defaultAbiCoder.encode(
        ["uint8", "string"],
        [insuranceTier, userWalletAddress]
    );

    const payloadHash = ethers.utils.keccak256(encodedPayload);

    const xrpTransaction = {
        TransactionType: "Payment",
        Account: process.env.ADDRESS,
        Amount: xrpl.xrpToDrops(10), //sending 10 xrp
        Destination: "rP9iHnCmJcVPtzCwYJjU1fryC2pEcVqDHv", // Axelar Multisig address on XRPL
        Memos: [
            {
                Memo: {
                    MemoData: {
                        MemoData: CONTRACT_ADDRESS, // Destination address (smart contract) without the 0x
                        MemoType: "64657374696E6174696F6E5F61646472657373", // hex("destination_address")
                    }
                },
                Memo: {
                    MemoData: {
                        MemoData: "7872706C2D65766D2D73696465636861696E", // hex("xrpl-evm-sidechain")
                        MemoType: "64657374696E6174696F6E5F636861696E", // hex("destination_chain")
                    }
                },
                Memo: {
                    MemoData: {
                        MemoData: payloadHash,
                        MemoType: "7061796C6F61645F68617368", // hex("payload_hash")
                    }
                }
            }
        ]
    }

    const signed = wallet.sign(await client.autofill(xrpTransaction));
    //Wait for contract call approval
    const response = await client.submitAndWait(signed.tx_blob);
    console.log("XRP transaction response: ", response);

    //Handle smart contract call
    const provider = ethers.providers.JsonRpcProvider(RPC_URL);
    const evmWallet = new ethers.Wallet(process.env.EVM_WALLET_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, AxelarExecutableWithToken.abi, evmWallet);
    contract.triggerPayout()


    await client.disconnect();


    try {
        
    } catch (e) {
        console.log(e);
        res.status(400).json({error: e.message});
    }
}

module.exports = { newFlightInsurance, executeSmartContract };