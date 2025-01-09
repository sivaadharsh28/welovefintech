const { savePendingFlightInsurance } = require("../misc/mongoose");

//run when user requests new flight insurance
const newFlightInsurance = async (req, res) => {
    let body = req.body;
    let user = body["user"]; //user xrpl account and other details
    let flight = body["flight"]; //flight data

    try {
        //Save claim to mongo
        const fieldsJson = {
            "userId": user["userId"],
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

module.exports = { newFlightInsurance };