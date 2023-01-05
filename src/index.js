const express = require("express");
const mongoose = require("mongoose");
const multer = require('multer')
//const aws = require('aws-sdk')
const route = require("./route/route");

const app = express();

app.use(express.json())
app.use(multer().any())

mongoose.connect("mongodb+srv://Anish_Tiwari1531:SINGH1531@cluster0.40jpapr.mongodb.net/unikwork?retryWrites=true&w=majority",
    { useNewUrlParser: true })

    .then(() => console.log("MongoDB Connected"))
    .catch((error) => console.log(error))

app.use('/', route)


app.listen(3000, function () {
    console.log("Express app running on Port 3000")
})