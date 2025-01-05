const { newFlightInsurance, makePayout } = require("../controllers/flightInsuranceController")
const express = require("express");
const router = express.Router();

router.post('/newInsurance', newFlightInsurance);
router.post('/payout', makePayout);

module.exports = router;