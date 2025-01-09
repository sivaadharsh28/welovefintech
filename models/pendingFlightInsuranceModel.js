const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pendingFlightInsurance = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    flightCode: {
        type: String,
        required: true,
    },
    departure: {
        type: Date,
        required: true,
    },
    arrival: {
        type: Date,
        required: true,
    },
})

module.exports = mongoose.model('PendingFlightInsurance', pendingFlightInsurance);