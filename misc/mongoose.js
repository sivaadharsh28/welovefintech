const PendingFlightInsurance = require("../models/pendingFlightInsuranceModel");

//Saves data from fieldsJson as mongo document
const savePendingFlightInsurance = async (fieldsJson) => {
    const flightInsurance = new PendingFlightInsurance(fieldsJson);
    await flightInsurance.save();
}

const getFlightsByArrival = async (arrivalDate) => {
    //scheduled arrival date: YYYY-MM-DD
    const results = await PendingFlightInsurance.find({arrival:arrivalDate}).exec();
    return results;
}


//Deletes mongo document by conditionHex
const deleteFlightInsurance = async (conditionHex) => {
    await PendingFlightInsurance.deleteOne({condition: conditionHex});
}

module.exports = { savePendingFlightInsurance, getFlightsByArrival, deleteFlightInsurance };