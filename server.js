const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const schedule = require("node-schedule");
const express = require("express");

const app = express();
const PORT = 300;
const MONGO_URI = process.env.MONGO_URI;

//import routes
const flightInsuranceRoutes = require("./routes/flightInsurance");
const testRoutes = require("./routes/test");

//middleware
app.use(express.json({strict:false}));

//routes
app.use("/api/flightInsurance", flightInsuranceRoutes);
app.use("/api/test", testRoutes);

/*
-------------------------- Server cache and Database watcher ------------------------------------------
*/

const PendingFlightInsurance = require("./models/pendingFlightInsuranceModel");
const User = require("./misc/mongoose");
let cache = new Map();

// Initializes the server cache. Cache is of type Map<DateString, Map<_id, Object>>
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
    })

    stream.on("error", (error) => {
        console.log("Watcher error:", error.message);
    })
}

/*
----------------------------- Smart Contract Oracle ----------------------------------------
*/
const { executeSmartContract } = require("./controllers/flightInsuranceController");
const { deleteFlightInsurance } = require("./misc/mongoose");

/**
 * Queries cache of insurances with flights landing today from the external flight API. 
 * If any flights are cancelled/diverted/etc, calls the smart contract to payout to the user
 */
async function pollFlightAPI () {
    const {getFlightData} = require("./misc/queryFlight");
    //Retrieve flight insurances from cache for today
    const today = new Date().toDateString();
    const flightsToday = cache.get(today);
    for (let [key, value] of flightsToday) {
        // make external flight API call
        let flightCode = value.flightCode;
        let departureDate = value.departure.toISOString().slice(0,10);
        const response = await getFlightData(flightCode, departureDate);
        
        const flightStatus = response.flight_status;
        const userId = value.userId;
        const {id, name, wallet, insuranceTier} = await User.getUserById(userId);
        
        if (flightStatus == "cancelled" || flightStatus == "incident" || flightStatus == "landed") {
            executeSmartContract(insuranceTier, userWallet);
        } else if (flightStatus == "landed") {
            deleteFlightInsurance(key);
        }
        
    }
}
// Poll flight API every 2 hours
const job = schedule.scheduleJob("0 */2 * * *", () => pollFlightAPI());


mongoose.connect(MONGO_URI, {dbName: "RippleShield"}).then(() => {
    app.listen(PORT, () => {
        initCache()
        .then(() => startWatcher());
        console.log(`Server listening on port ${PORT}`)
    });
}).catch(error => console.log(error));