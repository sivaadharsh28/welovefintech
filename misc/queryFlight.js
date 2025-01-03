const apiKey = process.env.AVIATION_STACK;

const getFlightData = async (flightCode) => {
    //sample IATA flightCode (string): SQ2435, TR4332

    let options = {
        method: "GET",
        headers: {Acccept: 'application/json'}
    }
    
    const response = await fetch(`https://api.aviationstack.com/v1/flights?access_key=${apiKey}?flight_iata=${flightCode}`, options);
    console.log(response);
}