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

app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send({ success: false, message: '404 Not Found' });
});

app.use(function (err, req, res, next) {
    res.type('text/plain');
    res.status(500);
    res.json({ success: false, message: '500 Server Error', data: err.stack });
    next(err);
});
let PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log('Server is up and running on ${PORT} ...');
})