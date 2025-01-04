const mongoose = require("mongoose");
const PendingFlightInsurance = require("../models/pendingFlightInsuranceModel");

const savePendingFlightInsurance = async (claimJson) => {
    //saves data provided into the 'pendingclaims' collection in mongo
    const claim = new PendingFlightInsurance(claimJson);
    await claim.save();
}

module.exports = { savePendingClaim };