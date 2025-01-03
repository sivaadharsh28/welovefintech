const express = require("express");
const app = express();
const PORT = 300;

//import routes
const requestRoutes = require("routes/request");

//TODO
//1. Create Oracle => Watch star alliance api if possible
//2. Create escrow 
//3. Link Oracle and escrow via fulfilment value

//middleware
app.use(express.json());

//routes
app.use("/api/claims", requestRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}}`)
})
