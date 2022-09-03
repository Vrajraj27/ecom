const { rejects } = require('assert');
const { resolve } = require('path');
const con = require('../config/config');
const nodemailer = require('nodemailer');
const { response } = require('express');
const { send } = require('process');

module.exports.register = async (txData) => {
    return new Promise((resolve, rejects) => {
        var sql = 'INSERT INTO register set?';
        con.query(sql, [txData], async (error, results, fields) => {
            console.log('error: ', error);
            if (error) {
                return resolve({
                    status: false,
                    message: "not go ",
                    data: null
                })
            }
            if (results) {
                var otp = Math.floor(Math.random() * 1000000);

                console.log('otp: ', otp);
                var sq = "UPDATE register SET otp = '" + otp + "' WHERE email = '" + txData.email + "'";
                con.query(sq, async (error, results) => {
                    if (error) {
                        return resolve({
                            status: false,
                            message: "otp not send",
                            data: error
                        });
                    }
                    if (results) {
                        var transporter = await nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'testy011999@gmail.com',
                                pass: 'gjygkiriytslspmf'
                            }
                        });
                        var mailOption = {
                            from: 'testy011999@gmail.com',
                            to: '"' + txData.email + '"',
                            subject: 'Send Otp',
                            text: "otp = '" + otp + "'"
                        };

                        transporter.sendMail(mailOption, async (error, info) => {
                            if (error) {
                                return response("unable to send otp");
                            } else {
                                return response("otp send");
                            }
                        });

                        // con.query("SELECT otp FROM register WHERE otp='" + otp + "' ", async (error, results) => {
                        //     if (error) throw error;
                        //     if (results) {
                        //         return resolve({
                        //             status: true,
                        //             message: "Otp send",
                        //             data: results
                        //         })
                        //     }
                        // });
                    }

                })

                // return resolve({
                //     status: true,
                //     data: results
                // });
            }
            return resolve({
                status: true,
                message: "User inserted not found",
                data: results
            })
        })
    })
}


module.exports.login = async (txData) => {
    return new Promise((resolve, rejects) => {
        var sql = 'SELECT * FROM register WHERE email ="' + txData.email + '"';
        console.log('sql: ', sql);
        con.query(sql, [txData], function (error, results, fields) {
            if (error) {
                return resolve({
                    status: false,
                    message: "incorrect email",
                    data: null
                })
            } else if (results == null) {
                return resolve({
                    status: false,
                    message: "incorrect email",
                    data: null
                })
            } else if (results) {
                var sql1 = 'SELECT password FROM register WHERE email ="' + txData.email + '"';
                console.log('sql1: ', sql1);
                con.query(sql1, function (error, results) {
                    if (error) {
                        return resolve({
                            status: false,
                            message: "error in getting pass ",
                            data: null
                        })
                    } else {
                        return resolve({
                            status: true,
                            message: "login successfully",
                            data: data.password
                        })
                    }
                })
            }
            return resolve({
                status: true,
                message: "User inserted not found",
                data: []
            })
        })
    })
}


module.exports.varifiy = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = 'SELECT * FROM register WHERE otp = "' + data.otp + '"'
        console.log('sql: ', sql);
        // console.log('sql: ', sql);
        con.query(sql, [data], (error, results) => {
            if (error) {
                return resolve({
                    status: false,
                    message: "otp not send",
                    data: null
                })
            };
            if (results) {
                return resolve({
                    status: true,
                    message: "Otp varified",
                    data: results
                })
            }
            // else {
            //     return resolve({
            //         status: true,
            //         message: "otp",
            //     })
            // }
        })
    })
}