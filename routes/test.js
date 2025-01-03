const { testQueryFlight } = require("../controllers/testController");
const express = require("express");
const router = express.Router();

router.post("/testQueryFlight", testQueryFlight);

module.exports = router;