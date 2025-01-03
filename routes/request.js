const { newFlightInsurance } = require("../controllers/claimController")
const express = require("express");
const router = express.Router();

router.post('/flightInsurance', newFlightInsurance);

module.exports = router;