const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const PendingFlightInsurance = require("./models/pendingFlightInsuranceModel");
const schedule = require("node-schedule");
const express = require("express");
// const initCache = require("./misc/initCache");
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
let cache = new Map();

//const job = schedule.scheduleJob("0 */2 * * *", () => {});

/**
 * Creates a cache of flight insurances. Cache is a Map<DateString, Map<document_id, insurance>>
 */
async function initCache() {
    try {
        const res = await PendingFlightInsurance.find();
        res.forEach((document) => {
            let date = document.arrival.toDateString();
            let id = document._id;
            let map;
            if (cache.has(date)) {
                map = cache.get(date);
            } else {
                map = new Map();
            }
            map.set(id.toString(), document);
            cache.set(date, map);
        });

        console.log(`Cache initialized with ${cache.size} date entries`);
        console.log(cache);
    } catch (e) {
        console.log(e)
    }
}

function startWatcher() {
    const stream = PendingFlightInsurance.watch();
    console.log("Starting watcher...");
    stream.on("change", (change) => {
        const { operationType, fullDocument, documentKey } = change;

        if (operationType == "delete") {
            console.log("Watcher: Delete detected");
            // Look through cache to find document to delete
            for (const [date, map] of cache.entries()) {
                if (map.get(documentKey._id.toString()) != undefined) {
                    map.delete(documentKey._id.toString());
                    cache.set(date, map);
                }
            }

        } else if (operationType == "insert") {
            console.log("Watcher: Insert detected");

            let date = fullDocument.arrival.toDateString(); //Get arrival date for this insurance
            let map = cache.get(date); //Get map of insurances for this arrival date

            // Create new map if map for this date does not exist
            if (map == undefined) {
                map = new Map();
            }
            map.set(documentKey._id.toString(), fullDocument);
            cache.set(date, map);
        }
        console.log(cache);
    })

    stream.on("error", (error) => {
        console.log("Watcher error:", error.message);
    })
}

const {executeSmartContract, fundSmartContract} = require("./controllers/flightInsuranceController");
//executeSmartContract();
//fundSmartContract();
mongoose.connect(MONGO_URI, {dbName: "RippleShield"}).then(() => {
    app.listen(PORT, () => {
        initCache();
        startWatcher();
        console.log(`Server listening on port ${PORT}`)
    });
}).catch(error => console.log(error));