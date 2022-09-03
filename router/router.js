var express = require('express');
var router = express.Router();

const controller = require("../controller/controller");

router.post("/register", controller.register);

router.post("/sendOtp", controller.varifiy);

router.post("/login", controller.login);

module.exports = router;