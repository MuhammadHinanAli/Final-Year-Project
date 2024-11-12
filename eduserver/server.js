require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 4000;

const MONGO_URI = process.env.MONGO_URI;

cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"]
});

app.use(express.json());

//MONGODB SET UP
mongoose
    .connect(MONGO_URI)
    .then(() => console.log("mongodb is connected"))
    .catch((e) => console.log(e));

//ROUTES CONFIGURATION

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong",
    });
});


//LISTENING PORT
app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`)
});    
