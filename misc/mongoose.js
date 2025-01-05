const PendingFlightInsurance = require("../models/pendingFlightInsuranceModel");

const savePendingFlightInsurance = async (claimJson) => {
    //saves data provided into the 'pendingclaims' collection in mongo
    const claim = new PendingFlightInsurance(claimJson);
    await claim.save();
}

const getFlightsByArrival = async (arrivalDate) => {
    //scheduled arrival date: YYYY-MM-DD
    const results = await PendingFlightInsurance.find({arrival:arrivalDate}).exec();
    return results;
}

module.exports = { savePendingFlightInsurance, getFlightsByArrival };