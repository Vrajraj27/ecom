require('dotenv').config()
const dotenv = require('dotenv')
const Validator = require('validatorjs');
var path = require("path");
const { request } = require('http');
const helper = require('../helper/helper');
const jwt = require("jsonwebtoken");
const joi = require('joi');
const { resolve } = require('path');
const { required } = require('joi');
const jwtSecret = "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611"
const fileValidation = (file) => {
    var extention = [".jpg", ".jpeg", ".png"];
    var fileExtention = path.extname(file.name);
    if (!extention.includes(fileExtention)) {
        return { status: false, message: "invalid file type" }
    }
    return { status: true }
}

module.exports.signup = (request, response, next) => {
    let rules = {
        name: "required",
        email: "email",
        password: "required",
        mobile: "required",
        address: "required"
    };

    let validation = new Validator(request.body, rules)
    if (validation.fails() == true) {
        return response.send(
            helper.statusFalse(validation.errors, null, "validation")
        );
    } else {
        if (request.files === null || request.files.image === null) {
            return response.send(helper.statusFalse("Profile Image Require"));
        }
        let imageValidation = fileValidation(
            request.files.image,
            null,
            "validation"
        );
        if (imageValidation.status === true) {
            return next();
        } else {
            return response.send(
                helper.statusFalse(
                    imageValidation.message,
                    null,
                    "validation"
                )
            )
        }
    }
};

module.exports.token = async function (request, response, next) {

    const token = request.headers.authorization

    jwt.verify(token, jwtSecret, (err, result) => {
        if (err) {
            console.log('err: ', err);
            return response.json({
                status: false,
                message: "Token is wrong or unavailable // Authentication Fail",
                data: null
            })

        }
        if (result) {
            request.body.user = result
            return next()
        };
    }
    )
}

module.exports.login = (request, response, next) => {
    let rules = {
        email: "email",
        password: "required"
    };

    let validation = new Validator(request.body, rules)
    if (validation.fails() == true) {
        return response.send(
            helper.statusFalse(validation.errors, null, "validation")
        );
    } else {
        return next();
    }
};

module.exports.head = (request, response, next) => {
    let rules = {
        id: "required",
        heading: "required"
    };

    let validation = new Validator(request.body, rules)
    if (validation.fails() == true) {
        return response.send(
            helper.statusFalse(validation.errors, null, "validation")
        );
    } else {
        return next();
    }
};

module.exports.id = (request, response, next) => {
    let rules = {
        id: "required"
    };

    let validation = new Validator(request.query, rules)
    if (validation.fails() == true) {
        return response.send(
            helper.statusFalse(validation.errors, null, "validation")
        );
    } else {
        return next();
    }
};

module.exports.idc = (request, response, next) => {
    let rules = {
        contentId: "required"
    };

    let validation = new Validator(request.body, rules)
    if (validation.fails() == true) {
        return response.send(
            helper.statusFalse(validation.errors, null, "validation")
        );
    } else {
        return next();
    }
};

module.exports.delCon = (request, response, next) => {
    let rules = {
        contentId: "required",
    };

    let validation = new Validator(request.body, rules)
    if (validation.fails() == true) {
        return response.send(
            helper.statusFalse(validation.errors, null, "validation")
        );
    } else {
        return next();
    }
};

module.exports.page = (request, response, next) => {
    let rules = {
        page: "required"
    };

    let validation = new Validator(request.query, rules)
    if (validation.fails() == true) {
        return response.send(
            helper.statusFalse(validation.errors, null, "validation")
        );
    } else {
        return next();
    }
};

module.exports.varify = (request, response, next) => {
    let rules = {
        email: "email",
        otp: "required"
    };

    let validation = new Validator(request.body, rules)
    if (validation.fails() == true) {
        return response.send(
            helper.statusFalse(validation.errors, null, "validation")
        );
    } else {
        return next();
    }
};

module.exports.changePass = (request, response, next) => {
    let rules = {
        oldPassword: "required",
        newPassword: "required"
    };

    let validation = new Validator(request.body, rules)
    if (validation.fails() == true) {
        return response.send(
            helper.statusFalse(validation.errors, null, "validation")
        );
    } else {
        return next();
    }
};

module.exports.forget = (request, response, next) => {
    let rules = {
        email: "email"
    };
    let validation = new Validator(request.body, rules)
    if (validation.fails() == true) {
        return response.send(
            helper.statusFalse(validation.errors, null, "validation")
        );
    } else {
        return next();
    }
};

module.exports.foret = (request, response, next) => {
    let rules = {
        email: "email"
    };
    let validation = new Validator(request.body, rules)
    if (validation.fails() == true) {
        return response.send(
            helper.statusFalse(validation.errors, null, "validation")
        );
    } else {
        return next();
    }
};

module.exports.updateEmail = (request, response, next) => {
    let rules = {
        email: "email",
        otp: "required"
    };
    let validation = new Validator(request.body, rules)
    if (validation.fails() == true) {
        return response.send(
            helper.statusFalse(validation.errors, null, "validation")
        );
    } else {
        return next();
    }
};

module.exports.forgetUpdate = (request, response, next) => {
    let rules = {
        email: "email",
        otp: "required",
        password: "required"
    };

    let validation = new Validator(request.body, rules)
    if (validation.fails() == true) {
        return response.send(
            helper.statusFalse(validation.errors, null, "validation")
        );
    } else {
        return next();
    }
};

module.exports.adminlogin = async (req, res, next) => {
    var body = req.body

    const schema = joi.object().keys({
        email: joi.string().email().required(),
        password: joi.string().min(6).required()
    });

    var validation = await schema.validate(body);
    if (validation.error) {
        res.send(validation.error.message)
    } else {
        return next()
    }
}


module.exports.delUser = async (req, res, next) => {
    var body = req.body

    const schema = joi.object().keys({
        id: joi.number().integer().min(1).required()
    });

    var validation = await schema.validate(body);
    if (validation.error) {
        res.send(validation.error.message)
    } else {
        return next()
    }
}

module.exports.deser = async (req, res, next) => {
    var body = req.query

    const schema = joi.object().keys({
        id: joi.number().integer().min(1).required()
    });

    var validation = await schema.validate(body);
    if (validation.error) {
        res.send(validation.error.message)
    } else {
        return next()
    }
}

module.exports.time = async (req, res, next) => {
    var body = req.body

    const schema = joi.object().keys({
        time: joi.number().integer().min(1).required()
    });

    var validation = await schema.validate(body);
    if (validation.error) {
        res.send(validation.error.message)
    } else {
        return next()
    }
}

module.exports.allow = async (req, res, next) => {
    var body = req.body

    const schema = joi.object().keys({
        allow: joi.number().integer().min(1).required()
    });

    var validation = await schema.validate(body);
    if (validation.error) {
        res.send(validation.error.message)
    } else {
        return next()
    }
}

module.exports.status = async (req, res, next) => {
    var body = req.query

    const schema = joi.object().keys({
        status: joi.number().integer().min(0).required()
    });

    var validation = await schema.validate(body);
    if (validation.error) {
        res.send(validation.error.message)
    } else {
        return next()
    }
}

module.exports.cate = async (req, res, next) => {
    var body = req.body

    const schema = joi.object().keys({
        name: joi.string().min(1).required()
    });

    var validation = await schema.validate(body);
    if (validation.error) {
        res.send(validation.error.message)
    } else {
        return next()
    }
}


module.exports.categ = async (req, res, next) => {
    var body = req.body

    const schema = joi.object().keys({
        id: joi.number().integer().min(1).required(),
        name: joi.string().min(1).required()
    });

    var validation = schema.validate(body);
    if (validation.error) {
        res.send(validation.error.message)
    } else {
        return next()
    }
}

module.exports.subc = async (req, res, next) => {
    var body = req.body

    const schema = joi.object().keys({
        catId: joi.number().integer().min(1).required(),
        name: joi.string().min(1).required()
    });

    var validation = await schema.validate(body);
    if (validation.error) {
        res.send(validation.error.message)
    } else {
        return next()
    }
}

module.exports.reje = async (req, res, next) => {
    var body = req.body

    const schema = joi.object().keys({
        id: joi.number().integer().min(1).required(),
        message: joi.string().min(1).required()
    });

    var validation = await schema.validate(body);
    if (validation.error) {
        res.send(validation.error.message)
    } else {
        return next()
    }
}

module.exports.updateUser = async (req, res, next) => {
    var body = req.body

    const schema = joi.object().keys({
        id: joi.number().integer().min(1).required(),
        name: joi.string().min(3).required(),
        email: joi.string().email().required(),
        mobile: joi.number().min(10).required(),
        address: joi.string().min(1).required(),
    });

    var validation = await schema.validate(body);
    if (validation.error) {
        res.send(validation.error.message)
    } else {
        return next()
    }
}


module.exports.upload = {}