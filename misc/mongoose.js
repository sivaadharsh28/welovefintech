const PendingFlightInsurance = require("../models/pendingFlightInsuranceModel");
const User = require("../models/userModel");

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

//Deletes mongo document by object id
const deleteFlightInsurance = async (id) => {
    await PendingFlightInsurance.deleteOne({_id: id});
}

// Users Collection
const getUserById = async (id) => {
    const results = await User.findOne({_id: id});
    return results;
}

module.exports = { savePendingFlightInsurance, getFlightsByArrival, deleteFlightInsurance, getUserById };