const { newFlightInsurance, executeSmartContract } = require("../controllers/flightInsuranceController")
const express = require("express");
const router = express.Router();

router.post('/newInsurance', newFlightInsurance);
router.post('/payout', executeSmartContract);

module.exports = router;