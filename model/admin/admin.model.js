const { rejects } = require('assert');
const { resolve } = require('path');
const con = require('../../config/config');
const nodemailer = require('nodemailer');
const { response } = require('express');
const { send, nextTick } = require('process');
const { error } = require('console');
const { request } = require('http');
const { search } = require('../../router/router');

module.exports.register = async (txData) => {
    return new Promise((resolve, rejects) => {
        var sql = 'INSERT INTO register set?';
        con.query(sql, [txData], async (error, results, fields) => {
            if (error) {
                return resolve({ status: false, message: "not go ", data: null })
            }
            if (results) {
                var otp = Math.floor(Math.random() * 1000000);
                if (otp.length <= 5) {
                    var otp = otp * 10
                }
                var sq = "UPDATE register SET otp = '" + otp + "' WHERE email = '" + txData.email + "'";
                con.query(sq, async (error, results) => {
                    if (error) {
                        return resolve({ status: false, message: "otp not send", data: error });
                    }
                    if (results) {
                        var transporter = await nodemailer.createTransport({
                            service: 'gmail', auth: { user: 'testy011999@gmail.com', pass: 'gjygkiriytslspmf' }
                        });
                        var mailOption = await { from: 'testy011999@gmail.com', to: '"' + txData.email + '"', subject: 'Send Otp', text: "otp = '" + otp + "'" };
                        transporter.sendMail(mailOption, async (error, info) => {
                            if (error) {
                                return resolve("unable to send otp");
                            }
                            else {
                                return resolve("otp send");
                            }
                        });
                    }
                })
            }
            return resolve({ status: true, message: "User inserted not found", data: results })
        })
    })
}

module.exports.adminLogin = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = 'SELECT email FROM register WHERE email = "' + data.email + '"';
        con.query(sql, function (error, results) {
            if (error) {
                return resolve({ status: false, message: "incorrect email", data: null })
            } else if (results.length < 0) {
                return resolve({ status: false, message: "email not inserted", data: null })
            } else if (results) {
                const sql = 'SELECT * FROM register WHERE email ="' + data.email + '"';
                con.query(sql, function (error, results) {
                    if (error) {
                        return resolve({ status: false, message: "error in getting password ", data: null })
                    }
                    if (results) {
                        return resolve({ status: true, message: "login successfully", data: results })
                    }
                })
            }
        })
    })
}

module.exports.deleteUser = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = ` UPDATE register SET isDeleted = 1 WHERE id = ${data.id} `;
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error in delete", data: results })
            }
            else if (results) {
                return resolve({ status: true, message: "deleted successfully", data: results })
            }
            else {
                return resolve({ status: false, message: "not deleted", data: results })
            }
        })
    })
}

module.exports.updateUser = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = "UPDATE register SET ? WHERE id = '" + data.id + "'";
        con.query(sql, [data], (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error in update", data: results })
            }
            else if (results) {
                return resolve({ status: true, message: "updated successfully", data: results })
            }
            else {
                return resolve({ status: false, message: "not updated", data: results })
            }
        })
    })
}

module.exports.getUsers = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = ` SELECT * FROM register WHERE (admin = 0 AND isDeleted = 0) LIMIT ${data.limit} OFFSET ${data.offset} `
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error on get", data: results })
            } else if (results) {
                return resolve({ status: true, message: "showing results", data: results })
            }
        })
    })
}

module.exports.getUser = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = `SELECT * FROM register WHERE id = ${data.id} AND (admin = 0 AND isDeleted = 0)`;
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error on get", data: results })
            } else if (results) {
                return resolve({ status: true, message: "showing results", data: results })
            }
        })
    })
}

module.exports.deletedUsers = async () => {
    return new Promise((resolve, rejects) => {
        var sql = ` SELECT * FROM register WHERE admin = 0 AND isDeleted = 1 `;
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error on get", data: results })
            } else if (results) {
                return resolve({ status: true, message: "showing results", data: results })
            }
        })
    })
}

module.exports.aproov = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = `UPDATE request SET status = 1 WHERE id = ${data.id}`;
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error on get", data: results })
            } else if (results) {
                return resolve({ status: true, message: "showing results", data: results })
            }
        })
    })
}

module.exports.reject = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = ` UPDATE request SET status = 2,message = '${data.message}' WHERE id = ${data.id} `;
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error on get", data: results })
            } else if (results) {
                return resolve({ status: true, message: "showing results", data: results })
            }
        })
    })
}

module.exports.rejectRes = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = 'SELECT status,message FROM request WHERE id = "' + data.id + '"'
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error on get", data: results })
            } else if (results) {
                return resolve({ status: true, message: "showing results", data: results })
            }
        })
    })
}

module.exports.requestBlk = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = ` UPDATE register SET blockContent = 1 WHERE id = ${data.id} `;
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error on get", data: results })
            } else if (results) {
                return resolve({ status: true, message: "user request block", data: results })
            }
        })
    })
}

module.exports.adminReq = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = `SELECT r.*,re.name AS name,re.email AS email FROM request AS r LEFT JOIN register AS re ON re.id = r.userId `;
        if (data.status == 0 && data.id) {
            sql += `WHERE r.status = ${data.status} AND r.userId = ${data.id}`
        }
        else if (data.status == 1 && data.id) {
            sql += `WHERE status = ${data.status} AND userId = ${data.id}`
        }
        else if (data.status == 2 && data.id) {
            sql += `WHERE status = ${data.status} AND userId = ${data.id}`
        }
        else if (data.search != null) {
            sql += `WHERE re.name LIKE '%${data.search}%' OR re.email LIKE '%${data.search}%'`
        }
        else if (data.date) {
            sql += `WHERE r.createdAt LIKE '%${data.date}%' OR r.updatedAt LIKE '%${data.date}%'`
        }
        else if (data.startDate) {
            sql += `WHERE r.createdAt > '${data.startDate}'`
        }
        else if (data.endDate) {
            sql += `WHERE r.createdAt <= '${data.endDate}'`
        }
        else if (data.startDate && data.endDate) {
            sql += `WHERE r.createdAt BETWEEN '${data.startDate}' AND '${data.endDate}'`
        }
        else if (data.status == 0) {
            sql += `WHERE r.status = ${data.status}`
        }
        else if (data.status == 1) {
            sql += `WHERE r.status = ${data.status}`
        }
        else if (data.status == 2) {
            sql += `WHERE r.status = ${data.status}`
        }
        else {
            sql += `WHERE userId = ${data.id}`
        }
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error on get", data: results })
            }
            else if (results.length <= 0) {
                return resolve({ status: true, message: "user not found", data: null })
            }
            else if (results) {
                return resolve({ status: true, message: "user requested", data: results })
            }
        })
    })
}

module.exports.adminReqAll = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = `SELECT r.userId AS userId,r.status AS status, r.message AS message,re.name AS name,re.email AS email,re.mobile AS mobile,re.address AS address,re.image AS image FROM request AS r LEFT JOIN register AS re ON re.id = r.userId WHERE r.status = ${data.status}`;
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error on get", data: results })
            } else if (results.length <= 0) {
                return resolve({ status: true, message: "no user available", data: results })
            }
            else if (results[0].status == 0) {
                return resolve({ status: true, message: "user requested pending", data: results })
            }
            else if (results[0].status == 1) {
                return resolve({ status: true, message: "user requested aproove", data: results })
            }
            else if (results[0].status == 2) {
                return resolve({ status: true, message: "user requested rejected", data: results })
            }
        })
    })
}

module.exports.setAllowreq = async (data) => {
    return new Promise((resolve, rejects) => {
        var query = "SELECT * FROM register WHERE id = '" + data.user.id + "'"
        con.query(query, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error on get", data: results })
            }
            if (results[0].admin == 1) {
                var sql = 'UPDATE setting SET velue = "' + data.allow + '" WHERE kiys = "allow"';
                con.query(sql, (error, results) => {
                    if (error) {
                        return resolve({ status: false, message: "error on get", data: results })
                    } else if (results) {
                        return resolve({ status: true, message: "user request block", data: results })
                    }
                })
            }
            else if (results.length <= 0 || results[0].admin == 0 || results) {
                return resolve({ status: true, message: "Mr.'" + data.user.name + "' You Are Not Admin", data: results })
            }
        })
    })
}

module.exports.setTime = async (data) => {
    return new Promise((resolve, rejects) => {
        var query = "SELECT * FROM register WHERE id = '" + data.user.id + "'"
        con.query(query, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error on get", data: results })
            }
            if (results[0].admin == 1) {
                var sql = 'UPDATE setting SET velue = "' + data.time + '" WHERE kiys = "time"';
                con.query(sql, (error, results) => {
                    if (error) {
                        return resolve({ status: false, message: "error on update", data: null })
                    } else if (results) {
                        return resolve({ status: true, message: "time Set for delay request is '" + data.time + "'", data: results })
                    }
                })
            }
            else if (results.length <= 0 || results[0].admin == 0 || results) {
                return resolve({ status: true, message: "Mr.'" + data.user.name + "' You Are Not Admin", data: results })
            }
        })
    })
}

module.exports.sCategory = async (data) => {
    return new Promise((resolve, rejects) => {
        var query = "SELECT * FROM register WHERE id = '" + data.user.id + "'"
        con.query(query, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error on get", data: results })
            }
            if (results[0].admin == 1) {
                var sql = 'INSERT INTO sCetegory (catId,name) VALUES ("' + data.catId + '","' + data.name + '")';
                con.query(sql, (error, results) => {
                    if (error) {
                        return resolve({ status: false, message: "error in insert data", data: null })
                    } else if (results) {
                        return resolve({ status: true, message: "Add '" + data.name + "' Successfully", data: results })
                    }
                })
            }
            else if (results[0].admin == 0 || results.length <= 0 || results) {
                return resolve({ status: true, message: "Mr.'" + data.user.name + "' You Are Not Admin", data: results })
            }
        })
    })
}

module.exports.sCategoryGet = async (data) => {
    return new Promise((resolve, rejects) => {
        var query = "SELECT * FROM register WHERE id = '" + data.user.id + "'"
        con.query(query, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error on get", data: results })
            }
            if (results[0].admin == 1) {
                var sql = 'SELECT * FROM sCetegory WHERE id = "' + data.id + '"';
                con.query(sql, (error, results) => {
                    if (error) {
                        return resolve({ status: false, message: "error in insert data", data: null })
                    } else if (results) {
                        return resolve({ status: true, message: "getted Successfully", data: results })
                    }
                })
            }
            else if (results[0].admin == 0 || results.length <= 0 || results) {
                return resolve({ status: true, message: "Mr.'" + data.user.name + "' You Are Not Admin", data: results })
            }
        })
    })
}

module.exports.sCategoryAll = async (data) => {
    return new Promise((resolve, rejects) => {
        var query = "SELECT * FROM register WHERE id = '" + data.user.id + "'"
        con.query(query, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error on get", data: results })
            }
            if (results[0].admin == 1) {
                var sql = 'SELECT * FROM sCetegory';
                con.query(sql, (error, results) => {
                    if (error) {
                        return resolve({ status: false, message: "error in insert data", data: null })
                    } else if (results) {
                        return resolve({ status: true, message: "getted Subcategory Successfully", data: results })
                    }
                })
            }
            else if (results[0].admin == 0 || results.length <= 0 || results) {
                return resolve({ status: true, message: "Mr.'" + data.user.name + "' You Are Not Admin", data: results })
            }
        })
    })
}

module.exports.sCategoryUpd = async (data) => {
    return new Promise((resolve, rejects) => {
        var query = "SELECT * FROM register WHERE id = '" + data.user.id + "'"
        con.query(query, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error on get", data: results })
            }
            if (results[0].admin == 1) {
                var sql = `UPDATE sCetegory SET name = '${data.name}' WHERE id = ${data.id}`;
                con.query(sql, (error, results) => {
                    if (error) {
                        return resolve({ status: false, message: "error in insert data", data: error })
                    } else if (results) {
                        return resolve({ status: true, message: "updated '" + data.name + "' Successfully", data: results })
                    }
                })
            }
            else if (results[0].admin == 0 || results.length <= 0 || results) {
                return resolve({ status: true, message: "Mr.'" + data.user.name + "' You Are Not Admin", data: results })
            }
        })
    })
}

module.exports.sCategoryDel = async (data) => {
    return new Promise((resolve, rejects) => {
        var query = "SELECT * FROM register WHERE id = '" + data.user.id + "'"
        con.query(query, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error on get", data: results })
            }
            if (results[0].admin == 1) {
                var sql = 'DELETE FROM sCetegory WHERE id = "' + data.id + '"';
                con.query(sql, (error, results) => {
                    if (error) {
                        return resolve({ status: false, message: "error in insert data", data: null })
                    } else if (results) {
                        return resolve({ status: true, message: "delete subCetegory Successfully", data: results })
                    }
                })
            }
            else if (results[0].admin == 0 || results.length <= 0 || results) {
                return resolve({ status: true, message: "Mr.'" + data.user.name + "' You Are Not Admin", data: results })
            }
        })
    })
}

module.exports.tag = async (data) => {
    return new Promise((resolve, rejects) => {
        var query = "SELECT * FROM register WHERE id = '" + data.user.id + "'"
        con.query(query, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error on get", data: results })
            }
            if (results[0].admin == 1) {
                var sql = 'INSERT INTO tag (name) VALUES ("' + data.name + '")';
                con.query(sql, (error, results) => {
                    if (error) {
                        return resolve({ status: false, message: "error in insert data", data: null })
                    } else if (results) {
                        return resolve({ status: true, message: "Add '" + data.name + "' As A Tag Successfully", data: results })
                    }
                })
            }
            else if (results[0].admin == 0 || results.length <= 0 || results) {
                return resolve({ status: true, message: "Mr.'" + data.user.name + "' You Are Not Admin", data: results })
            }
        })
    })
}

module.exports.tagdel = async (data) => {
    return new Promise((resolve, rejects) => {
        var query = "SELECT * FROM register WHERE id = '" + data.user.id + "'"
        con.query(query, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error on get", data: results })
            }
            if (results[0].admin == 1) {
                var sql = 'DELETE FROM tag WHERE id = "' + data.id + '"';
                con.query(sql, (error, results) => {
                    if (error) {
                        return resolve({ status: false, message: "error in insert data", data: null })
                    } else if (results) {
                        return resolve({ status: true, message: "delete A Tag Successfully", data: results })
                    }
                })
            }
            else if (results[0].admin == 0 || results.length <= 0 || results) {
                return resolve({ status: true, message: "Mr.'" + data.user.name + "' You Are Not Admin", data: results })
            }
        })
    })
}

module.exports.tagUpd = async (data) => {
    return new Promise((resolve, rejects) => {
        var query = "SELECT * FROM register WHERE id = '" + data.user.id + "'"
        con.query(query, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error on get", data: results })
            }
            if (results[0].admin == 1) {
                var sql = 'UPDATE tag SET name = "' + data.name + '" WHERE id = "' + data.id + '"';
                con.query(sql, (error, results) => {
                    if (error) {
                        return resolve({ status: false, message: "error in insert data", data: null })
                    } else if (results) {
                        return resolve({ status: true, message: "Add '" + data.name + "' As A Tag Successfully", data: results })
                    }
                })
            }
            else if (results[0].admin == 0 || results.length <= 0 || results) {
                return resolve({ status: true, message: "Mr.'" + data.user.name + "' You Are Not Admin", data: results })
            }
        })
    })
}

module.exports.tagGet = async (data) => {
    return new Promise((resolve, rejects) => {
        var query = "SELECT * FROM register WHERE id = '" + data.user.id + "'"
        con.query(query, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error on get", data: results })
            }
            if (results[0].admin == 1) {
                var sql = 'SELECT * FROM tag WHERE id = "' + data.id + '"';
                con.query(sql, (error, results) => {
                    if (error) {
                        return resolve({ status: false, message: "error in insert data", data: null })
                    } else if (results) {
                        return resolve({ status: true, message: "get a tag", data: results })
                    }
                })
            }
            else if (results[0].admin == 0 || results.length <= 0 || results) {
                return resolve({ status: true, message: "Mr.'" + data.user.name + "' You Are Not Admin", data: results })
            }
        })
    })
}

module.exports.tagGetAll = async (data) => {
    return new Promise((resolve, rejects) => {
        var query = "SELECT * FROM register WHERE id = '" + data.user.id + "'"
        con.query(query, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error on get", data: results })
            }
            if (results[0].admin == 1) {
                var sql = 'SELECT * FROM tag';
                con.query(sql, (error, results) => {
                    if (error) {
                        return resolve({ status: false, message: "error in insert data", data: null })
                    } else if (results) {
                        return resolve({ status: true, message: "get All tag Successfully", data: results })
                    }
                })
            }
            else if (results[0].admin == 0 || results.length <= 0 || results) {
                return resolve({ status: true, message: "Mr.'" + data.user.name + "' You Are Not Admin", data: results })
            }
        })
    })
}

module.exports.getProfiles = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = ` SELECT c.id AS contentId,c.heading AS heading,c.paragraph AS paragraph,c.catId AS category,r.id AS userId,r.name AS userName,r.email AS userEmail,r.mobile AS Number,r.address AS address,r.image AS userImage,i.imageName AS contentImage,(SELECT COUNT(*) FROM likes) AS totalLikes,(SELECT COUNT(*) FROM views) AS totalViews FROM content AS c LEFT JOIN register AS r ON r.id = c.userId LEFT JOIN image AS i ON i.contentId = c.id LEFT JOIN likes ON likes.contentId = c.id LEFT JOIN views ON views.contentId = c.id LIMIT ${data.limit} OFFSET ${data.offset} `
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error on get", data: results })
            } else if (results) {
                return resolve({ status: true, message: "showing results", data: results })
            }
        })
    })
}