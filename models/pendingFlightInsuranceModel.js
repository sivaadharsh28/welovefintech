const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pendingFlightInsurance = new Schema({
    flightCode: {
        type: String,
        required: true,
    },
    departure: {
        type: String,
        required: true,
    },
    arrival: {
        type: String,
        required: true,
    },
    offerSequence: {
        type: String,
        required: true,
    },
    condition: {
        type: String,
        required: true,
    },
    fulfillment: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('PendingFlightInsurance', pendingFlightInsurance);