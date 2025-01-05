const PendingFlightInsurance = require("../models/pendingFlightInsuranceModel");

const initCache = async () => {
    try {
        const res = await PendingFlightInsurance.find();
        return res;
    } catch (e) {
        console.log(e)
        return null;
    }
}

module.exports = initCache;
