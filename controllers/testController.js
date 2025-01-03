const { getFlightData } = require("../misc/queryFlight");

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

module.exports = {testQueryFlight};