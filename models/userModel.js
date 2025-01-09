const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema({
    name: {
        type: String,
        required: true
    },
    wallet: {
        type: String,
        required: true
    },
    insuranceTier: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('User', user);