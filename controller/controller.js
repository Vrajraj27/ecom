// const express = require('express');
const nodemailer = require('nodemailer');
const model = require('../model/model');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { strictEqual } = require('assert');
dotenv.config();
process.env.TOKEN_SECRET;

module.exports.register = async (request, response) => {
    try {
        const { name, email, password, mobile, address, image, otp } = request.body;

        // var pass = null;
        var generatePassword = await bcrypt.hash(password, saltRounds);

        const txData = {
            name: name,
            email: email,
            password: generatePassword,
            mobile: mobile,
            address: address,
            image: image,
            otp: otp
        };


        const sql1 = 'SELECT email FROM register WHERE email="' + email + '"';
        console.log('sql1: ', sql1);
        const sql2 = 'SELECT mobile FROM register WHERE mobile ="' + mobile + '"';
        // if (sql1) {
        //     return response.json({
        //         status: true,
        //         message: "User already Exist",
        //         data: null
        //     });
        // }
        // else if (sql2) {
        //     return response.json({
        //         status: true,
        //         message: "User already Exist",
        //         data: null
        //     });
        // }
        const addData = await model.register(txData);

        if (!addData.status) {
            return response.json({
                status: false,
                message: addData.message,
                data: null
            })
        } else {
            return response.json({
                status: true,
                message: "data added",
                data: txData
            });
        }

        // const addData = await model.register(txData);
        // 
        // if (!addData.status) {
        //     return response.json({
        //         status: false,
        //         message: addData.message,
        //         data: null
        //     })
        // } else {
        //     return response.json({
        //         status: true,
        //         message: "data added",
        //         data: txData
        //     });
        // }
    }
    catch (e) {

        return response.status(500).json({
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
}

module.exports.login = async (request, response) => {
    try {
        const { email, password } = request.body;

        const txData = {
            email: email,
            password: password,
        };

        const addData = await model.login(txData);
        console.log('addData: ', addData);
        if (!(addData.status || addData.results.status)) {
            console.log('(addData.status || addData.results.status): ', (addData.status || addData.results.status));
            return response.json({
                status: false,
                message: addData.message,
                data: null
            })
        }
        // var email = email;
        function generateAccessToken(email) {
            return jwt.sign(email, process.env.TOKEN_SECRET, { expiresIn: '18000s' });
        }

        bcrypt.compare(password, addData.data[0].password, function (err, result) {


            if (result) {

                const token = generateAccessToken({ email: request.body.email });
                function authenticateToken(request, response, next) {
                    const authHeader = request.headers['authorization']
                    const token = authHeader && authHeader.split(' ')[1]

                    if (token == null) {
                        return response.json({
                            status: false,
                            message: "Token is null",
                            data: null
                        })
                    }

                    jwt.verify(token, process.env.TOKEN_SECRET, (err, result) => {
                        if (err) {
                            return response.json({
                                status: false,
                                message: "Token Not Verify",
                                data: null
                            })
                        }
                        request.email = email
                        next()
                    })
                }
                return response.json({
                    status: true,
                    message: "Login Successfully & Token Generated",
                    data: addData, token, email
                });
            } else {
                return response.json({
                    status: false,
                    message: "Login unsuccessfully",
                    data: null
                });

            }
        })


    }
    catch (e) {

        return response.status(500).json({
            status: false,
            message: "Something Went Wrong",
            data: null,
        });
    }
}

module.exports.varifiy = async (request, response) => {
    try {
        const { otp } = request.body;

        const txData = {
            otp: otp
        };

        const addData = await model.varifiy(txData);

        if (!addData.status) {
            return response.json({
                status: false,
                message: addData.message,
                data: null
            })
        } else {
            return response.json({
                status: true,
                message: "otp varified",
                data: txData
            });
        }
    } catch (e) {
        return response.json({
            status: true,
            message: "otp not sure",
            data: txData
        })
    }
}