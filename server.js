const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const schedule = require("node-schedule");
const express = require("express");
const initCache = require("./misc/initCache");
const app = express();
const PORT = 300;
const MONGO_URI = process.env.MONGO_URI;

//import routes
const flightInsuranceRoutes = require("./routes/flightInsurance");
const testRoutes = require("./routes/test");

//TODO
//1. Create Oracle => Watch flight data api if possible
//2. Create escrow 
//3. Link Oracle and escrow via fulfilment value

//middleware
app.use(express.json({strict:false}));

//routes
app.use("/api/flightInsurance", flightInsuranceRoutes);
app.use("/api/test", testRoutes);

// run every 2 hours, poll mongo for changes, update local cache, 
// search local cache for flights that are due to land, make payouts accordingly
let cache;

//const job = schedule.scheduleJob("0 */2 * * *", () => {});

mongoose.connect(MONGO_URI, {dbName: "RippleShield"}).then(() => {
    app.listen(PORT, () => {
        cache = initCache();
        console.log(`Server listening on port ${PORT}`)
    });
}).catch(error => console.log(error));