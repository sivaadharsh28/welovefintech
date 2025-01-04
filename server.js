const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const PORT = 300;

//import routes
const requestRoutes = require("./routes/request");
const testRoutes = require("./routes/test");

//TODO
//1. Create Oracle => Watch flight data api if possible
//2. Create escrow 
//3. Link Oracle and escrow via fulfilment value

//middleware
app.use(express.json({strict:false}));

//routes
app.use("/api/claims", requestRoutes);
app.use("/api/test", testRoutes);

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {dbName: "RippleShield"}).then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}}`)
    });
}).catch(error => console.log(error));

