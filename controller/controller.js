const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const con = require('../config/config');
const model = require('../model/model');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const jwtSecret = "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611"
const { strictEqual } = require('assert');
const { error } = require('console');
const { request } = require('http');
const { response } = require('express');
const valid = require('../validator/validator');
// const { addData } = require('./content/content.controller');
dotenv.config();

function generateString(length) {
    var result = '';
    var characters = '123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports.register = async (request, response) => {
    try {
        const { name, email, password, mobile, address } = request.body;
        const sql1 = 'SELECT * FROM register WHERE isDeleted = 0 AND (email = "' + email + '" OR mobile ="' + mobile + '")';
        con.query(sql1, async function (error, result) {
            if (error) {
                return response.json({ status: false, message: "error", data: error });
            }
            if (result && result.length > 0) {
                return response.json({ status: true, message: "User already Exist", data: result });
            } else {
                var otp = Math.floor(Math.random() * 1000000);
                if (otp.length <= 5) { let otp = otp * 10 }
                var generatePassword = await bcrypt.hash(password, saltRounds);
                let file = request.files.image
                let filename = file.name
                const newFilename = generateString(8) + filename.split(" ").join("-");
                const path = __dirname + "/profile/" + newFilename
                file.mv(path, async function (error) {
                    if (error) {
                        return resolve({ status: false, message: "image Upload fail in storage", data: null })
                    }
                })
                const txData = {
                    name: name,
                    email: email,
                    password: generatePassword,
                    mobile: mobile,
                    address: address,
                    image: newFilename,
                    otp: otp
                };
                var mailOption = { from: 'testy011999@gmail.com', to: '"' + txData.email + '"', subject: 'Send Otp', text: "otp = '" + txData.otp + "'" };
                var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: 'testy011999@gmail.com', pass: 'gjygkiriytslspmf' } });
                let data = {
                    transporter: transporter,
                    mailOption: mailOption
                }
                const addData = await model.register(txData, data);

                if (!addData.status) {
                    return response.json({ status: false, message: addData.message, data: addData.data })
                } else {
                    return response.json({ status: true, message: "data added" });
                };
            }
        })
    }
    catch (e) {
        return response.status(500).json({ status: false, message: "Something Went To Wrong", data: null, });
    }
}

module.exports.login = async (request, response) => {
    try {
        const { email, password } = request.body;
        var sql = 'SELECT * FROM register WHERE email = "' + email + '"';
        con.query(sql, async (error, results) => {
            if (error) {
                return response.json({ status: false, message: "error in login", data: null })
            }
            if (results == 0) {
                return response.json({ status: false, message: "please enter valid email", data: email })
            }
            if (results[0].isDeleted == 1) {
                return response.json({ status: false, message: "your account is deleted", data: email })
            }
            if (results[0].admin == 1) {
                return response.json({ status: false, message: "your are not a user", data: email })
            }
            if (results[0].varify == 0) {
                return response.json({ status: false, message: "please varify email", data: email })
            }
            if (results[0].varify == 1) {
                bcrypt.compare(password, results[0].password, function (err, result) {
                    if (err) {
                        return response.json({
                            status: false, message: "Login unsuccessfully", data: null
                        });
                    }
                    if (result == false) {
                        return response.json({ status: false, message: "login unsucceccfully", data: null });
                    }
                    if (result) {
                        let authenticationToken = jwt.sign(JSON.stringify(results[0]), jwtSecret);
                        return response.json({ status: true, message: "login Succeccfully", data: results[0], authenticationToken });
                    }
                })
            }
        })
    } catch (e) {
        return response.status(500).json({ status: false, message: "Something Went Wrong", data: null, });
    }
}

module.exports.varifiy = async (request, response) => {
    try {
        const { email, otp } = request.body;
        const txData = {
            email: email,
            otp: otp
        };

        const addData = await model.varifiy(txData);

        if (!addData.status) {
            return response.json({ status: false, message: addData.message, data: null })
        } else {
            return response.json({ status: true, message: "otp varified", data: addData });
        }
    } catch (e) {
        return response.json({ status: true, message: "otp not sure", data: addData })
    }
}

module.exports.profile = async (request, response) => {
    try {
        var query = request.query;
        var type = query.type;
        var page = query.page;
        var search = query.search ? query.search : null;
        var sType = query.sType ? query.sType : null;
        var offset = (page - 1) * 10;
        var limit = 10;
        var id = query.id;
        var name = query.name;
        var email = query.email;
        var password = query.password;
        var mobile = query.mobile;
        var address = query.address;
        var image = query.image;
        var otp = query.otp;
        var createdAt = query.createdAt;
        var updatedAt = query.updatedAt;
        var varify = query.varify;
        var admin = query.admin;
        var date = query.date;
        var dateStart = query.dateStart;
        var dateEnd = query.dateEnd;

        data = {
            id: id,
            name: name,
            email: email,
            password: password,
            mobile: mobile,
            address: address,
            image: image,
            otp: otp,
            createdAt: createdAt,
            updatedAt: updatedAt,
            varify: varify,
            admin: admin,
            page: page,
            date: date,
            dateStart: dateStart,
            dateEnd: dateEnd,
            type: type,
            search: search,
            sType: sType,
            offset: offset,
            limit: limit
        }

        const addData = await model.profile(data)
        if (!addData.status) {
            return response.json({ status: addData.status, message: addData.message, data: addData.data })
        }
        if (addData.status) {
            return response.json({ status: addData.status, message: addData.message, data: addData.data });
        }
        else {
            return response.json({ status: false, message: "", data: null });
        }
    }
    catch (error) {
        return response.status(500).json({ status: false, message: "Something Went Wrong", data: null, });
    }
}

module.exports.forget = async (request, response) => {
    try {
        const { email } = request.body;
        var otp = Math.floor(Math.random() * 1000000);
        const data = {
            email: email,
            otp: otp
        }

        var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: 'testy011999@gmail.com', pass: 'gjygkiriytslspmf' } });
        var mailOption = await { from: 'testy011999@gmail.com', to: '"' + data.email + '"', subject: 'Send Otp', text: "otp = '" + otp + "'" };

        var sql = 'SELECT password FROM register WHERE email = "' + data.email + '"';
        con.query(sql, async (error, results, fields) => {
            if (error) {
                return response.json({ status: false, message: "not go ", data: null })
            }
            if (results) {
                const addData = await model.forget(data)
                if (!addData.status) {
                    return response.json({ status: false, message: "error", data: null })
                }
                if (addData.status) {
                    transporter.sendMail(mailOption, async (error, info) => {
                        if (error) {
                            return response.json({ status: false, message: "not go ", data: null });
                        }
                        else {
                            return response.json({ status: true, message: "otp send ", data: info });
                        }
                    })
                }
            }
        })
    }
    catch {
        return response.json({ status: false, message: "some error", data: null })
    }
}
module.exports.forgetUdt = async (request, response) => {
    try {
        const { email, otp, password } = request.body
        const gPassword = await bcrypt.hash(password, saltRounds);
        const data = {
            email: email,
            otp: otp,
            password: gPassword
        }

        addData = await model.forgetUdt(data)
        if (!addData.status) {
            return response.json({ status: false, message: addData.message, data: null })
        }
        if (addData.status) {
            return response.json({ status: true, message: addData.message, data: addData.data })
        }
    } catch {
        return response.json({ status: false, message: "some error", data: null })
    }
}

module.exports.changePassword = async (request, response) => {
    try {
        let auth = request.body
        let user = auth.user
        let oldPassword = auth.oldPassword
        let newPassword = auth.newPassword

        const data = {
            user: user,
            oldPassword: oldPassword,
            newPassword: newPassword
        }
        bcrypt.compare(oldPassword, user.password, async function (err, result) {
            if (err) {
                return response.json({ status: false, message: "Login unsuccessfully", data: null });
            }
            if (result) {
                var generatePassword = await bcrypt.hash(data.newPassword, saltRounds);
                const pass = { generatePassword: generatePassword }
                const addData = await model.changePassword(data, pass)

                if (!addData.status) {
                    return response.json({ status: false, message: addData.message, data: null })
                }
                if (addData.status) {
                    return response.json({ status: true, message: addData.message, data: addData.data })
                }
            }
        })
    } catch (e) {
        return response.json({ status: false, message: "something went wrong", data: null })
    }
}

module.exports.updateEmail = async (request, response) => {
    try {
        let auth = request.body
        let user = auth.user
        let email = auth.email
        var otp = Math.floor(Math.random() * 1000000);
        if (otp.length <= 5) {
            var otp = otp * 10
        }
        var data = {
            user: user,
            email: email,
            otp: otp
        }
        var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: 'testy011999@gmail.com', pass: 'gjygkiriytslspmf' } });
        var mailOption = { from: 'testy011999@gmail.com', to: '"' + data.email + '"', subject: 'Send Otp', text: "otp = '" + otp + "'" };
        let mail = {
            transporter: transporter,
            mailOption: mailOption
        }
        addData = await model.updateEmail(data, mail);

        if (!addData.status) {
            return response.json({ status: false, message: addData.message, data: null })
        }
        if (addData.status) {
            return response.json({ status: true, message: addData.message, data: addData.data })
        }
    } catch (e) {
        return response.json({ status: false, message: "Something went Wrong", data: null })
    }
}

module.exports.updateEmailVarify = async (request, response) => {
    try {
        let auth = request.body
        let user = auth.user
        let email = auth.email
        let otp = auth.otp
        let data = {
            user: user,
            email: email,
            otp: otp
        };

        addData = await model.updateEmailVarify(data);

        if (!addData.status) {
            return response.json({ status: false, message: addData.message, data: null })
        }
        if (addData.status) {
            return response.json({ status: true, message: addData.message, data: addData.data })
        }
    } catch (e) {
        return response.json({ status: false, message: "Something went Wrong", data: null })
    }
}

module.exports.deleteProfile = async (request, response) => {
    try {
        let auth = request.body
        let user = auth.user
        var data = {
            user: user
        }

        addData = await model.deleteProfile(data);
        if (!addData.status) {
            return response.json({ status: false, message: addData.message, data: null })
        }
        if (addData.status) {
            return response.json({ status: true, message: addData.message, data: addData.data })
        }
    } catch (e) {
        return response.json({ status: false, message: "Something went Wrong", data: null })
    }
}

module.exports.updateProfile = async (request, response) => {
    try {
        let auth = request.body
        let file = request.files.image
        console.log('file: ', file);
        let user = auth.user
        let name = auth.name
        let mobile = auth.mobile
        let address = auth.address
        var filename = file.name
        console.log('filename: ', filename);
        var mimetype = file.mimetype
        const newFilename = generateString(8) + filename.split(" ").join("-");
        const path = __dirname + "/profile/" + newFilename
        file.mv(path, function (error) {
            if (error) {
                return resolve({ status: false, message: "image Upload fail in storage", data: null })
            }
        })

        var data = {
            name: name,
            mobile: mobile,
            address: address,
            image: newFilename
        }

        const addData = await model.updateProfile(data, user);
        if (!addData.status) {
            return response.json({ status: false, message: addData.message, data: null })
        }
        if (addData.status) {
            return response.json({ status: true, message: addData.message, data: addData.data })
        }
    } catch (error) {
        return response.json({ status: false, message: "Something went Wrong", data: null })
    }
}

module.exports.getProfile = async (request, response) => {
    try {
        let auth = request.body
        let user = auth.user
        var data = {
            user: user
        }

        const addData = await model.getProfile(data);
        if (!addData.status) {
            return response.json({ status: false, message: addData.message, data: addData.data })
        }
        if (addData.status) {
            return response.json({ status: true, message: addData.message, data: addData.data })
        }
    } catch (e) {
        return response.json({ status: false, message: "Something went Wrong", data: null })
    }
}