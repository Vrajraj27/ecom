const { rejects } = require('assert');
const { resolve } = require('path');
const con = require('../config/config');
const nodemailer = require('nodemailer');
const { response } = require('express');
const { send, nextTick } = require('process');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { error } = require('console');
const { request } = require('http');

module.exports.register = async (txData, data) => {
    return new Promise((resolve, rejects) => {
        var sql = 'INSERT INTO register SET ?';
        con.query(sql, [txData], (error, results, fields) => {
            if (error) {
                return resolve({ status: false, message: "not go ", data: error })
            }
            if (results) {
                data.transporter.sendMail(data.mailOption, async (error, info) => {
                    if (error) { return resolve("unable to send otp"); }
                    else {
                        return resolve({ status: true, message: "SuccesFully ", data: info })
                    }
                });
            }
        })
    })
}


module.exports.login = async (txData) => {
    return new Promise((resolve, rejects) => {
        var sql = 'SELECT * FROM register WHERE email = "' + txData.email + '"';
        con.query(sql, function (error, results, fields) {
            if (error) {
                return resolve({ status: false, message: "incorrect email", data: null })
            }
            else if (results == null) {
                return resolve({ status: false, message: "email not inserted", data: null })
            }
            if (results) {
                return resolve({ status: true, message: "login successfully", data: results })
            }
        })
    })
}


module.exports.varifiy = async (txData) => {
    return new Promise((resolve, rejects) => {
        var sql = "UPDATE register SET varify = 1 WHERE email = '" + txData.email + "' AND otp = '" + txData.otp + "'";
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "otp not send", data: null })
            };
            if (results.affectedRows == 0) {
                return resolve({ status: false, message: " incorrect otp", data: null })
            } else if (results.affectedRows == 1) {
                return resolve({ status: true, message: "otp varify", data: results.message })
            }
        })
    })
}

module.exports.profile = async (data) => {
    return new Promise((resolve, reject) => {

        var sql = ` SELECT * FROM register `

        if (data.page == 1) {
            if (data.type == 1) {
                sql += `WHERE varify = 1 `
            } else if (data.type == 2) {
                sql += `WHERE varify != 1 `
            } else if (data.type == 3) {
                sql += `WHERE admin = 1 `
            } else if (data.type == 4) {
                sql += `WHERE admin != 1 `
            }
            if (data.search != null) {
                if (data.dateEnd && data.search && data.varify) {
                    sql += `WHERE createdAt < '${data.dateEnd}' AND (email LIKE '%${data.search}%' OR name LIKE '%${data.search}%') AND varify = '${data.varify}' `
                }
                else if (data.dateStart && data.search && data.varify) {
                    sql += `WHERE createdAt > '${data.dateStart}' AND (email LIKE '%${data.search}%' OR name LIKE '%${data.search}%') AND varify = '${data.varify}' `
                }
                else if (data.dateEnd && data.search) {
                    sql += `WHERE createdAt < '${data.dateEnd}' AND (email LIKE '%${data.search}%' OR name LIKE '%${data.search}%') `
                }
                else if (data.dateStart && data.search) {
                    sql += `WHERE createdAt > '${data.dateStart}' AND (email LIKE '%${data.search}%' OR name LIKE '%${data.search}%') `
                }
                else if (data.search) {
                    sql += `WHERE email LIKE '%${data.search}%' OR name LIKE '%${data.search}%' `
                }
            }
            else if (data.dateEnd) {
                sql += `WHERE createdAt > '${data.dateEnd}' LIKE '%${data.search}%' `
            }
            else if (data.dateStart) {
                sql += `WHERE createdAt > '${data.dateStart}' LIKE '%${data.search}%' `
            }
            else if (data.name) {
                sql += `WHERE name LIKE '%${data.name}%' `
            }
            else if (data.search) {
                sql += `WHERE email LIKE '%${data.search}%' OR name LIKE '%${data.search}%' `
            }
            else if (data.mobile) {
                sql += `WHERE mobile LIKE '${data.mobile}%' `
            } else if (data.dateStart && data.dateEnd) {
                sql += `WHERE createdAt BETWEEN '${data.dateStart}' AND '${data.dateEnd}' `
            } else if (data.email) {
                sql += `WHERE email LIKE '%${data.email}%' `
            } else if (data.page) {
                sql += ``
            } else if (data.date) {
                sql += `WHERE createdAt LIKE '%${data.date}%' `
            }
        }
        sql += `LIMIT ${data.limit} OFFSET ${data.offset}`

        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error for getting profile", data: null })
            }
            if (results) {
                return resolve({ status: true, message: "get profile successfully", data: results })
            } else {
                return resolve({ status: false, message: "not id available", data: null })
            }
        })
    })
}

module.exports.forget = async (data) => {
    return new Promise((resolve, rejects) => {
        var sq = "UPDATE register SET otp = '" + data.otp + "' WHERE email = '" + data.email + "'";
        con.query(sq, async (error, results) => {
            if (error) {
                return resolve({ status: false, message: "otp not send", data: error });
            }
            if (results) {
                return resolve({ status: true, message: "otp send", data: results });
            }
        })
    })
}

module.exports.forgetUdt = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = 'UPDATE register SET password = "' + data.password + '" WHERE email = "' + data.email + '" AND otp = "' + data.otp + '"';
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "not go ", data: null })
            } else if (results) {
                return resolve({ status: true, message: "otp varified & password change", data: results })
            }
        })
    })
}


module.exports.changePassword = async (data, pass) => {
    return new Promise(async (resolve, rejects) => {
        var sql = 'UPDATE register SET password = "' + pass.generatePassword + '" WHERE id = "' + data.user.id + '"';
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "not go ", data: null })
            } else if (results) {
                return resolve({ status: true, message: "Password change Successfully", data: results })
            }
        })
    })
}

module.exports.updateEmail = async (data, mail) => {
    return new Promise(async (resolve, rejects) => {
        var sq = "UPDATE register SET otp = '" + data.otp + "' WHERE id = '" + data.user.id + "'";
        con.query(sq, async (error, results) => {
            if (error) {
                return resolve({ status: false, message: "otp not send", data: error });
            }
            if (results) {
                mail.transporter.sendMail(mail.mailOption, async (error, info) => {
                    if (error) {
                        return resolve({ status: false, message: "unable to send otp", data: null });
                    }
                    else {
                        return resolve({ status: true, message: "otp send", data: info })
                    }
                })
            }
        })
    })
}

module.exports.updateEmailVarify = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = "UPDATE register SET email = '" + data.email + "' WHERE otp = '" + data.otp + "' AND id = '" + data.user.id + "'";
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "email not Updated", data: error });
            }
            if (results) {
                return resolve({ status: true, message: "email updated Successfully", data: results });
            }
        })
    })
}

module.exports.deleteProfile = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = "UPDATE register SET isDeleted = 1 WHERE id = '" + data.user.id + "'";
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "USER not deleted", data: error });
            }
            if (results) {
                return resolve({ status: true, message: "email deleted Successfully", data: results });
            }
        })
    })
}

module.exports.updateProfile = async (data, user) => {
    return new Promise((resolve, rejects) => {
        var sql = "UPDATE register SET ? WHERE id = '" + user.id + "'";
        con.query(sql, [data], (error, results) => {
            if (error) {
                return resolve({ status: false, message: "profile upadate error", data: error });
            }
            if (results) {
                return resolve({ status: true, message: "profile updated Successfully", data: results });
            }
        })
    })
}

module.exports.getProfile = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = "SELECT c.id AS contentId,c.heading AS heading,c.paragraph AS paragraph,c.catId AS category,ct.name AS categoryName,r.id AS userId,r.name AS userName,r.email AS userEmail,r.mobile AS Number,r.address AS address,r.image AS userImage,i.imageName AS contentImage,(SELECT COUNT(*) FROM likes) AS totalLikes,(SELECT COUNT(*) FROM views) AS totalViews FROM content AS c LEFT JOIN cetegory AS ct ON ct.id = c.catId LEFT JOIN register AS r ON r.id = c.userId LEFT JOIN image AS i ON i.contentId = c.id LEFT JOIN likes ON likes.contentId = c.id LEFT JOIN views ON views.contentId = c.id WHERE r.id = '" + data.user.id + "'";
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "USER not deleted", data: error });
            }
            if (results) {
                return resolve({ status: true, message: "profile of '" + data.user.name + "' get Successfully", data: results });
            }
        })
    })
}