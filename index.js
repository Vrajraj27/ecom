const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const router = require("./router/router");
const config = require("./config/config");

const app = express()
var bodyParser = require('body-parser')
dotenv.config();

app.use(bodyParser.json());


app.use("/", router)





let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is up and running on ${PORT} ...');
})
// app.listen(3300);