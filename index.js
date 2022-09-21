const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const router = require("./router/router");
const config = require("./config/config");
var bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express()
dotenv.config();

app.use(express.static(__dirname + "/image"))
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ createParentPath: true }));

app.use("/", router)

let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is up and running on ${PORT} ...');
})