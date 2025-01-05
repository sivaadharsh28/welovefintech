const PendingFlightInsurance = require("../models/pendingFlightInsuranceModel");

const initCache = async () => {
    const cache = new Map();
    try {
        const res = await PendingFlightInsurance.find();
        res.forEach((document) => {
            let date = new Date(document.arrival.toDateString); //get date portion of dateTime
            let arr;
            if (cache.has(date)) {
                arr = cache.get(date);
                arr.push(document);
            } else {
                arr = [document];
            }
            cache.set(date, arr);
        });

        console.log(`Cache initialized with ${cache.size} entries`);
        return cache;
    } catch (e) {
        console.log(e)
        return null;
    }
}

module.exports = initCache;
