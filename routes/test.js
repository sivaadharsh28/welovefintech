const { testQueryFlight, callFundContract, callExecuteContract } = require("../controllers/testController");
const express = require("express");
const router = express.Router();

// NOTE: These routes are only meant to be accessed for testing/demo purposes ONLY

router.post("/testQueryFlight", testQueryFlight);

router.post("/fundContract", callFundContract);

router.post("/executeContract", callExecuteContract);

module.exports = router;