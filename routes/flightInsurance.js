const { newFlightInsurance } = require("../controllers/flightInsuranceController")
const express = require("express");
const router = express.Router();

router.post('/newFlightInsurance', newFlightInsurance);

module.exports = router;