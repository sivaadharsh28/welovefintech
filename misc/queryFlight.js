const apiKey = process.env.AVIATION_STACK;

//fetches flight data from external API, extracts status, estimated arrival time
const getFlightData = async (flightCode, departureDate) => {
    //sample IATA flightCode (string): SQ2435, TR4332
    //departureDate format: YYYY-MM-DD

    let options = {
        method: "GET",
        headers: {Acccept: 'application/json'}
    }
    
    const response = await fetch(`https://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${flightCode}`, options);
    let res_json = await response.json();
    const data = res_json["data"];
    let targetFlight = data.find(flight => {
        return flight["flight_date"] == departureDate;
    })
    return targetFlight;
}

module.exports = { getFlightData };