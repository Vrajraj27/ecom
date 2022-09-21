const { rejects } = require('assert');
const multer = require('multer');
const { resolve } = require('path');
const con = require('../../config/config');
const nodemailer = require('nodemailer');
const { response, query } = require('express');
const { send, nextTick } = require('process');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { error } = require('console');
const { request } = require('http');

var dateTime = require('node-datetime');
var dt = dateTime.create();


function generateString(length) {
    var result = '';
    var characters = '123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports.addData = async (data) => {
    return new Promise((resolve, rejects) => {
        var sq = "SELECT * FROM request WHERE userId = '" + data.user.id + "' AND status = 1"
        con.query(sq, (error, results) => {
            if (error) {
                return resolve({ status: false, message: error, data: error })
            }
            if (results.length <= 0) {
                return resolve({ status: false, message: "you are not aproove", data: error })
            }
            if (results) {
                return resolve({ status: true })
            }
        })
    })
}


module.exports.headingAll = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = `SELECT heading,id AS contentId FROM content LIMIT ${data.limit} OFFSET ${data.offset}`
        con.query(sql, [data], (error, results) => {
            if (error) {
                return resolve({ status: false, message: error, data: error })
            }
            if (results) {
                return resolve({ status: true, message: "selected heading Successfully", data: results })
            }
        })
    })
}

module.exports.addDataa = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = "INSERT INTO content(userId,catId,heading,paragraph) VALUES ('" + data.userId + "','" + data.catId + "','" + data.heading + "','" + data.paragraph + "')"
        con.query(sql, (error, results) => {
            console.log('results: ', results);
            if (error) {
                return resolve({ status: false, message: error, data: error })
            }
            if (results.length <= 0) {
                return resolve({ status: false, message: "no", data: results })
            }
            if (results) {
                var content = results.insertId;
                return resolve({ status: true, data: content })
            }
        })
    })
}

module.exports.adddDataa = async (data, content) => {
    return new Promise((resolve, rejects) => {
        var tag = data.array
        var cont = [];
        var usI = [];
        var tagg = [];
        for (i = 0; i < tag.length; i++) {
            cont.push(content.con)
            usI.push(data.user.id)
            tagg.push([tag[i], cont[i], usI[i]])
        }
        if (tag.length == tagg.length) {
            var sq = "INSERT INTO tagg (tagId, contentId, userId) VALUES ?"
            con.query(sq, [tagg], (error, results) => {
                if (error) {
                    return resolve({
                        status: false,
                        message: "tag error",
                        data: null
                    })
                }
                if (results) {
                    return resolve({
                        status: true,
                    })
                }
            })
        }
    })
}


module.exports.adata = async (data, content) => {
    return new Promise((resolve, rejects) => {
        var filename = data.file.name
        var mimetype = data.file.mimetype
        const newFilename = generateString(8) + filename.split(" ").join("-");
        const path = __dirname + "/image/" + newFilename

        data.file.mv(path, (error) => {
            if (error) {
                return resolve({ status: false, message: "image Upload fail in storage", data: null })
            } else {
                var sql = "INSERT INTO image(imageName,contentId) VALUES ('" + newFilename + "','" + content.con + "')"
                con.query(sql, (error, result) => {
                    if (error) {
                        return resolve({ status: false, message: "image Upload fail in db", data: null })
                    }
                    if (result.length <= 0) {
                        return resolve({ status: false, message: "image Upload fail", data: null })
                    }
                    if (result) {
                        return resolve({ status: true, message: "image Upload successfully in storage and db", data: result })
                    }
                })
            }
        })
    })
}

module.exports.aadata = async (data, content) => {
    return new Promise((resolve, rejects) => {
        var Array = [];
        var Brray = [];
        for (n = 0; n < data.file.length; n++) {
            var filename = data.file[n].name
            var mimetype = data.file[n].mimetype
            const newFilename = generateString(8) + filename.split(" ").join("-");
            const path = __dirname + "/image/" + newFilename

            data.file[n].mv(path, (error) => {
                if (error) {
                    return resolve({ status: false, message: "image Upload fail in storage", data: null })
                } else {
                    Array.push(newFilename)
                    Brray.push(content.con)
                    if (Array.length == data.file.length) {
                        var Crray = []
                        for (i = 0; i < Array.length; i++) {
                            Crray.push([Array[i], Brray[i]])
                        }
                        if (Crray.length == Array.length) {
                            var sql = `INSERT INTO image (imageName, contentId) VALUES ?`
                            con.query(sql, [Crray], (error, result) => {
                                if (error) {
                                    return resolve({ status: false, message: error, data: error })
                                }
                                if (result) {
                                    return resolve({ status: true, message: "image Upload successfully in storage and db", data: result })
                                }
                            })
                        }
                    }
                }
            })
        }
    })
}

module.exports.heading = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = `SELECT heading FROM content WHERE userId = ${data.user.id}`
        con.query(sql, [data], (error, results) => {
            if (error) {
                return resolve({ status: false, message: error, data: error })
            }
            if (results) {
                return resolve({ status: true, message: "selected heading Successfully", data: results })
            }
        })
    })
}

module.exports.headingUpd = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = 'SELECT * FROM content WHERE id = "' + data.id + '"'
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: error, data: error })
            }
            if (results) {
                if (results[0].userId == data.user.id) {
                    var sql = 'UPDATE content SET heading = "' + data.heading + '" WHERE id = "' + data.id + '"'
                    con.query(sql, (error, results) => {
                        if (error) {
                            return resolve({ status: false, message: error, data: error })
                        }
                        if (results) {
                            return resolve({ status: true, message: "Updated", data: results })
                        }
                    })
                }
            }
        })
    })
}


module.exports.get = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = `SELECT c.id AS contentId,c.heading AS heading,c.paragraph AS paragraph,c.catId AS category,r.id AS userId,r.name AS userName,r.email AS userEmail,r.mobile AS Number,r.address AS address,r.image AS userImage,i.imageName AS contentImage,(SELECT COUNT(*) FROM likes) AS totalLikes,(SELECT COUNT(*) FROM views) AS totalViews FROM content AS c LEFT JOIN register AS r ON r.id = c.userId LEFT JOIN image AS i ON i.contentId = c.id LEFT JOIN likes ON likes.contentId = c.id LEFT JOIN views ON views.contentId = c.id WHERE r.id = ${data.id} `
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: error, data: error })
            }
            if (results) {
                return resolve({ status: true, message: "selected Successfully", data: results })
            }
        })
    })
}


module.exports.like = async (data) => {
    return new Promise((resolve, rejects) => {
        var query = "SELECT * FROM likes WHERE userId = '" + data.user.id + "' AND contentId = '" + data.contentId + "'"
        con.query(query, (error, results) => {
            if (error) {
                return resolve({ status: false, message: error, data: error })
            }
            if (results.length <= 0) {
                var sq = "INSERT INTO likes (contentId,userId) VALUES ('" + data.contentId + "','" + data.user.id + "') "
                con.query(sq, (error, results) => {
                    if (error) {
                        return resolve({ status: false, message: error, data: error })
                    }
                    if (results.length <= 0) {
                        return resolve({ status: true, message: "like unSuccessfully", data: results })
                    }
                    if (results) {
                        return resolve({ status: true, message: "like Successfully", data: results })
                    }
                })
            }
            else if (results) {
                return resolve({ status: true, message: "liked already", data: results })
            }
        })
    })
}


module.exports.dislike = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = "UPDATE content SET likes = likes - 1 WHERE id = '" + data.id + "'"
        con.query(sql, [data], (error, results) => {
            if (error) {
                return resolve({ status: false, message: error, data: error })
            }
            if (results) {
                return resolve({ status: true, message: "dislike Successfully", data: results })
            }
        })
    })
}

module.exports.view = async (data) => {
    return new Promise((resolve, rejects) => {
        var query = "SELECT * FROM views WHERE userId = '" + data.user.id + "' AND contentId = '" + data.contentId + "'"
        con.query(query, (error, results) => {
            if (error) {
                return resolve({ status: false, message: error, data: error })
            }
            if (results.length <= 0) {
                var sq = "INSERT INTO views(contentId,userId) VALUES ('" + data.contentId + "','" + data.user.id + "') "
                con.query(sq, (error, results) => {
                    if (error) {
                        return resolve({ status: false, message: error, data: error })
                    }
                    if (results.length <= 0) {
                        return resolve({ status: true, message: "view unSuccessfully", data: results })
                    }
                    if (results) {
                        return resolve({ status: true, message: "view Successfully", data: results })
                    }
                })
            }
            else if (results) {
                return resolve({ status: true, message: "view already", data: results })
            }
        })
    })
}


module.exports.cetegory = async (data) => {
    return new Promise((resolve, rejects) => {
        let sq = "SELECT * FROM register WHERE id = '" + data.user.id + "' AND admin = 1"
        con.query(sq, (error, results) => {
            if (error) {
                return resolve({ status: false, message: error, data: error })
            }
            if (results.length <= 0) {
                return resolve({ status: false, message: "You Are Not Admin", data: results })
            }
            if (results) {
                let sql = "INSERT INTO cetegory SET name = '" + data.name + "'"
                con.query(sql, (error, results) => {
                    if (error) {
                        return resolve({ status: false, message: error, data: error })
                    }
                    if (results) {
                        return resolve({ status: true, message: "category added Successfully", data: results })
                    }
                })
            }
        })
    })
}

module.exports.cetegoryGet = async (data) => {
    return new Promise((resolve, rejects) => {
        let sq = "SELECT * FROM register WHERE id = '" + data.user.id + "' AND admin = 1"
        con.query(sq, (error, results) => {
            if (error) {
                return resolve({ status: false, message: error, data: error })
            }
            if (results.length <= 0) {
                return resolve({ status: false, message: "You Are Not Admin", data: results })
            }
            if (results) {
                let sql = "SELECT * FROM cetegory WHERE id = '" + data.id + "'"
                con.query(sql, (error, results) => {
                    if (error) {
                        return resolve({ status: false, message: error, data: error })
                    }
                    if (results) {
                        return resolve({ status: true, message: "category select", data: results })
                    }
                })
            }
        })
    })
}

module.exports.cetegoryGetAll = async (data) => {
    return new Promise((resolve, rejects) => {
        let sq = "SELECT * FROM register WHERE id = '" + data.user.id + "' AND admin = 1"
        con.query(sq, (error, results) => {
            if (error) {
                return resolve({ status: false, message: error, data: error })
            }
            if (results.length <= 0) {
                return resolve({ status: false, message: "You Are Not Admin", data: results })
            }
            if (results) {
                let sql = "SELECT * FROM cetegory"
                con.query(sql, (error, results) => {
                    if (error) {
                        return resolve({ status: false, message: error, data: error })
                    }
                    if (results) {
                        return resolve({ status: true, message: "category selected", data: results })
                    }
                })
            }
        })
    })
}

module.exports.cetegoryUpdate = async (data) => {
    return new Promise((resolve, rejects) => {
        let sq = "SELECT * FROM register WHERE id = '" + data.user.id + "' AND admin = 1"
        con.query(sq, (error, results) => {
            if (error) {
                return resolve({ status: false, message: error, data: error })
            }
            if (results.length <= 0) {
                return resolve({ status: false, message: "You Are Not Admin", data: results })
            }
            if (results) {
                let sql = "UPDATE cetegory SET name = '" + data.name + "' WHERE id = '" + data.id + "'"
                con.query(sql, (error, results) => {
                    if (error) {
                        return resolve({ status: false, message: error, data: error })
                    }
                    if (results) {
                        return resolve({ status: true, message: "category added Successfully", data: results })
                    }
                })
            }
        })
    })
}

module.exports.cetegoryDel = async (data) => {
    return new Promise((resolve, rejects) => {
        let sq = "SELECT * FROM register WHERE id = '" + data.user.id + "' AND admin = 1"
        con.query(sq, (error, results) => {
            if (error) {
                return resolve({ status: false, message: error, data: error })
            }
            if (results.length <= 0) {
                return resolve({ status: false, message: "You Are Not Admin", data: results })
            }
            if (results) {
                let sql = "DELETE FROM cetegory WHERE id = '" + data.id + "'"
                con.query(sql, (error, results) => {
                    if (error) {
                        return resolve({ status: false, message: error, data: error })
                    }
                    if (results) {
                        return resolve({ status: true, message: "category deleted Successfully", data: results })
                    }
                })
            }
        })
    })
}

module.exports.request = async (data) => {
    return new Promise((resolve, rejects) => {
        let s = "SELECT COUNT(*) AS count FROM request WHERE userId = '" + data.user.id + "'"
        con.query(s, (er, rs) => {
            if (er) {
                return resolve({ status: false, message: "Some error in request", data: er })
            }
            if (rs) {
                var n = rs[0].count - 1
                if (n == -1) {
                    n = 0
                }
                let q = "SELECT velue FROM setting WHERE kiys = 'allow'"
                con.query(q, (errr, reee) => {
                    if (errr) {
                        return resolve({ status: false, message: "Some error in request", data: er })
                    }
                    else {
                        var f = reee[0].velue
                    }
                    if (n < f) {
                        let sq = "SELECT r.*,re.blockContent AS blockContent FROM request AS r LEFT JOIN register AS re ON r.userId = re.id WHERE userId = '" + data.user.id + "'"
                        con.query(sq, (error, result) => {
                            if (error) {
                                return resolve({ status: false, message: "Some error in request", error, data: error })
                            }
                            else if (result.length <= 0) {
                                let sql = " INSERT INTO request(userId) VALUES ('" + data.user.id + "') "
                                con.query(sql, (error, results) => {
                                    if (error) {
                                        return resolve({ status: false, message: "Some error in request", error, data: error })
                                    }
                                    if (results) {
                                        return resolve({ status: true, message: "requested Successfully", data: results })
                                    }
                                })
                            }
                            else if (result[n].blockContent == 1) {
                                return resolve({ status: false, message: "User is Block For Add Content", data: null })
                            }
                            else if (result[n].status == 0) {
                                return resolve({ status: false, message: "Your request already pending", data: null })
                            } else if (result[n].status == 1) {
                                return resolve({ status: false, message: "Your request already aprooved", data: null })
                            }
                            else if (result[n].status == 2) {
                                let query = "SELECT velue FROM setting WHERE kiys = time"
                                con.query(query, (e, r) => {
                                    if (e) {
                                        return resolve({ status: false, message: "Please Try After Sometime", data: null })
                                    } else if (r.length <= 0) {
                                        return resolve({ status: false, message: "Please Try After Sometime", data: null })
                                    } else if (r) {
                                        const seconds = new Date().getTime()
                                        const update = result[0].updatedAt.getTime()
                                        if (seconds < update + r[0].velue) {
                                            return resolve({ status: false, message: "Please Try After Sometime", data: null })
                                        }
                                        else if (seconds > update + r[0].velue) {
                                            let sql = " INSERT INTO request(userId) VALUES ('" + data.user.id + "') "
                                            con.query(sql, (error, results) => {
                                                if (error) {
                                                    return resolve({ status: false, message: "Some error in request", error, data: error })
                                                }
                                                if (results) {
                                                    return resolve({ status: true, message: "requested Successfully", data: results })
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                            else if (result) {
                                let sql = " INSERT INTO request(userId) VALUES ('" + data.user.id + "') "
                                con.query(sql, (error, results) => {
                                    if (error) {
                                        return resolve({ status: false, message: "Some error in request", error, data: error })
                                    }
                                    if (results) {
                                        return resolve({ status: true, message: "requested Successfully", data: results })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    })
}

module.exports.totalLike = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = "SELECT l.*, c.userId AS creatorId,c.heading AS heading,c.paragraph AS paragraph FROM likes AS l LEFT JOIN content AS c ON c.id = l.contentId WHERE l.userId = '" + data.user.id + "'"
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: error, data: error })
            }
            if (results) {
                return resolve({ status: true, message: "content like by '" + data.user.name + "'", data: results })
            }
        })
    })
}

module.exports.totalView = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = "SELECT v.*, c.heading AS heading, c.paragraph AS paragraph FROM views AS v LEFT JOIN content AS c ON c.id = v.contentId WHERE l.userId = '" + data.user.id + "'"
        con.query(sql, [data], (error, results) => {
            if (error) {
                return resolve({ status: false, message: error, data: error })
            }
            if (results) {
                return resolve({ status: true, message: "content like by '" + data.user.name + "'", data: results })
            }
        })
    })
}

module.exports.inAllLike = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = "SELECT c.id AS ContentId, c.userId AS CreatorId, c.catId AS CategoryID, c.heading AS Heading, c.paragraph AS Paragraph, c.createdAt AS CreateDate, l.userId = '" + data.user.id + "' AS likeByYou, r.name AS CreatorName, r.email AS creatorEmail, r.image AS creatorImage FROM likes AS l RIGHT JOIN content AS c ON c.id = l.contentId LEFT JOIN register AS r ON r.id = c.userId ";
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: error, data: error })
            }
            if (results) {
                return resolve({ status: true, message: "content like by '" + data.user.name + "'", data: results })
            }
        })
    })
}

module.exports.tagAdd = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = "INSERT INTO tagg (contentId,tagId,userId) VALUES ('" + data.contentId + "','" + data.tagId + "','" + data.user.id + "')"
        con.query(sql, [data], (error, results) => {
            if (error) {
                return resolve({ status: false, message: error, data: error })
            }
            if (results) {
                return resolve({ status: true, message: "content tag by '" + data.user.name + "'", data: results })
            }
        })
    })
}

module.exports.tagGet = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = "SELECT tg.tagId AS tagId, t.name AS tagName, c.userId AS creatorId, c.heading AS heading, c.paragraph AS paragraph, tg.userId AS userId, r.name AS userName FROM tagg AS tg LEFT JOIN content AS c ON c.id = tg.contentId LEFT JOIN register AS r ON r.id = tg.userId LEFT JOIN tag AS t ON t.id = tg.tagId WHERE tg.userId = '" + data.user.id + "'"
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: error, data: error })
            }
            if (results) {
                return resolve({ status: true, message: "content tag by '" + data.user.name + "'", data: results })
            }
        })
    })
}

module.exports.image = async (data) => {
    return new Promise((resolve, rejects) => {
        var filename = data.file.name
        var mimetype = data.file.mimetype
        const newFilename = generateString(8) + filename.split(" ").join("-");
        const path = __dirname + "/image/" + newFilename

        data.file.mv(path, (error) => {
            if (error) {
                return response.json({ status: false, message: "image Upload fail in storage", data: null })
            } else {
                var sql = "UPDATE image SET imageName = '" + newFilename + "' WHERE id = '" + data.id + "'"
                con.query(sql, (error, result) => {
                    if (error) {
                        return resolve({ status: false, message: "image Upload fail in db", data: null })
                    }
                    if (result.length <= 0) {
                        return resolve({ status: false, message: "image Upload fail", data: null })
                    }
                    if (result) {
                        return resolve({ status: true, message: "image Upload successfully in storage and db", data: result })
                    }
                })
            }
        })
    })
}

module.exports.imageMulti = async (data) => {
    return new Promise((resolve, rejects) => {
        if (data.array != null && data.file != null) {
            var sql = `DELETE FROM image WHERE id IN (${data.array})`
            con.query(sql, (error, results) => {
                if (error) {
                    return resolve({ status: false, message: "image Upload fail in db", data: null })
                }
                if (results.length <= 0) {
                    return resolve({ status: false, message: "enter valid Id", data: null })
                }
                if (results) {
                    var contentId = data.contentId;
                    if (data.file.length === undefined) {
                        var filename = data.file.name
                        var mimetype = data.file.mimetype
                        const newFilename = generateString(8) + filename.split(" ").join("-");
                        const path = __dirname + "/image/" + newFilename

                        data.file.mv(path, (error) => {
                            if (error) {
                                return response.json({ status: false, message: "image Upload fail in storage", data: null })
                            } else {
                                var sql = "INSERT INTO image(imageName,contentId) VALUES ('" + newFilename + "','" + contentId + "')"
                                con.query(sql, (error, result) => {
                                    if (error) {
                                        return resolve({ status: false, message: "image Upload fail in db", data: null })
                                    }
                                    if (result.length <= 0) {
                                        return resolve({ status: false, message: "image Upload fail", data: null })
                                    }
                                    if (result) {
                                        return resolve({ status: true, message: "image Upload successfully in storage and db", data: result })
                                    }
                                })
                            }
                        })
                    }
                    else {
                        var contentId = data.contentId;
                        n = 0
                        while (n < data.file.length) {
                            var filename = data.file[n].name
                            var mimetype = data.file[n].mimetype
                            const newFilename = generateString(8) + filename.split(" ").join("-");
                            const path = __dirname + "/image/" + newFilename

                            data.file[n].mv(path, (error) => {
                                if (error) {
                                    return response.json({ status: false, message: "image Upload fail in storage", data: null })
                                } else {
                                    var sql = "INSERT INTO image(imageName,contentId) VALUES ('" + newFilename + "','" + contentId + "')"
                                    con.query(sql, (error, result) => {
                                        if (error) {
                                            return resolve({ status: false, message: error, data: error })
                                        }
                                        if (result) {
                                            return resolve({ status: true, message: "ok", data: result })
                                        }
                                    })
                                }
                            })
                            n++
                        }
                    }
                }
            })
        }
        else
            if (data.id !== null) {
                var sql = `DELETE FROM image WHERE id IN (${data.array})`
                con.query(sql, (error, results) => {
                    if (error) {
                        return resolve({ status: false, message: "image Upload fail in db", data: null })
                    }
                    if (results.length <= 0) {
                        return resolve({
                            status: false,
                            message: "enter valid Id",
                            data: null
                        })
                    }
                    if (results) {
                        return resolve({
                            status: false,
                            message: "deleted Successfully",
                            data: null
                        })
                    }
                })
            } else if (data.file != null) {
                if (data.file.length === undefined) {

                    var filename = data.file.name
                    var mimetype = data.file.mimetype
                    const newFilename = generateString(8) + filename.split(" ").join("-");

                    const path = __dirname + "/image/" + newFilename

                    data.file.mv(path, (error) => {

                        if (error) {
                            return resolve({
                                status: false,
                                message: "image Upload fail in storage",
                                data: null
                            })
                        } else {
                            var sql = "INSERT INTO image(imageName,contentId) VALUES ('" + newFilename + "','" + contentId + "')"
                            con.query(sql, (error, result) => {
                                if (error) {
                                    return resolve({
                                        status: false,
                                        message: "image Upload fail in db",
                                        data: null
                                    })
                                }
                                if (result.length <= 0) {
                                    return resolve({
                                        status: false,
                                        message: "image Upload fail",
                                        data: null
                                    })
                                }
                                if (result) {
                                    return resolve({
                                        status: true,
                                        message: "image Upload successfully in storage and db",
                                        data: result
                                    })
                                }
                            })
                        }
                    })
                }
                else {
                    var contentId = data.contentId
                    n = 0
                    while (n < data.file.length) {
                        var filename = data.file[n].name
                        var mimetype = data.file[n].mimetype
                        const newFilename = generateString(8) + filename.split(" ").join("-");

                        const path = __dirname + "/image/" + newFilename

                        data.file[n].mv(path, (error) => {

                            if (error) {
                                return resolve({
                                    status: false,
                                    message: "image Upload fail in storage",
                                    data: null
                                })
                            } else {
                                var sql = "INSERT INTO image(imageName,contentId) VALUES ('" + newFilename + "','" + contentId + "')"
                                con.query(sql, (error, result) => {
                                    if (error) {
                                        return resolve({
                                            status: false,
                                            message: error,
                                            data: error
                                        })
                                    }
                                    if (result) {
                                        return resolve({
                                            status: true,
                                            message: "ok",
                                            data: result
                                        })
                                    }
                                })
                            }
                        })
                        n++
                    }
                }
            }
    })
}


module.exports.ima = async (data) => {
    return new Promise((resolve, rejects) => {

        var sql = `delete from image where id in (${data.array})`
        con.query(sql, (error, result) => {
            if (error) {
                return resolve({
                    status: false,
                    message: "image Upload fail in db",
                    data: error
                })
            }
            if (result) {
                return resolve({
                    status: true,
                    message: "image Upload fail in db",
                    data: result
                })
            }
        })
    })
}


module.exports.delIma = async (data) => {
    return new Promise((resolve, rejects) => {

        var sql = "SELECT * FROM content WHERE id = '" + data.contentId + "'"
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error getting content", data: null })
            }
            if (results.length <= 0) {
                return resolve({ status: false, message: "not found content", data: error })
            }
            if (results) {
                if (results[0].userId == data.user.id) {
                    if (data.tag != undefined) {
                        var tag = data.arr
                        console.log('tag: ', tag, tag.length);
                        var cont = []
                        var usI = []
                        var tagg = []
                        for (i = 0; i < tag.length; i++) {
                            cont.push(data.contentId)
                            usI.push(data.user.id)
                            tagg.push([tag[i], cont[i], usI[i]])
                        }
                        if (tag.length == tagg.length) {
                            var qury = "DELETE FROM tagg WHERE contentId = '" + data.contentId + "'"
                            con.query(qury, (error, ress) => {
                                if (error) {
                                    return resolve({ status: false, message: "tag error", data: error })
                                }
                                if (ress) {
                                    var sq = "INSERT INTO tagg (tagId, contentId, userId) VALUES ?"
                                    con.query(sq, [tagg], (error, results) => {
                                        if (error) {
                                            return resolve({ status: false, message: "tag error", data: error })
                                        }
                                        if (results) {
                                            return resolve({ status: true, message: "tag added", data: results })
                                        }
                                    })
                                }
                            })
                        }
                    }
                    if (data.heading !== undefined) {
                        var sql = "UPDATE content SET heading = '" + data.heading + "' WHERE id = '" + data.contentId + "'"
                        con.query(sql, (error, result) => {
                            if (error) {
                                return resolve({ status: false, message: "error getting content", data: null })
                            }
                            if (result.length <= 0) {
                                return resolve({ status: false, message: "not found content", data: error })
                            } else if (result) {
                                return resolve({ status: true, message: "data Updated", data: result })
                            }
                        })
                    }
                    if (data.paragraph !== undefined) {
                        var sql = "UPDATE content SET paragraph = '" + data.paragraph + "' WHERE id = '" + data.contentId + "'"
                        con.query(sql, (error, result) => {
                            if (error) {
                                return resolve({ status: false, message: "error getting content", data: null })
                            }
                            if (result.length <= 0) {
                                return resolve({ status: false, message: "not found content", data: error })
                            } else if (result) {
                                return resolve({ status: false, message: "data Updated", data: result })
                            }
                        })
                    }
                    var content = data.contentId;
                    if (data.file.length === undefined) {
                        var Array = data.array
                        var Brray = []
                        for (j = 0; j < Array.length; j++) {
                            Brray.push(content)
                        }
                        var filename = data.file.name
                        var mimetype = data.file.mimetype
                        const newFilename = generateString(8) + filename.split(" ").join("-");
                        const path = __dirname + "/image/" + newFilename

                        data.file.mv(path, (error) => {
                            if (error) {
                                return resolve({ status: false, message: "image Upload fail in storage", data: null })
                            } else {
                                Array.push(newFilename)
                                Brray.push(content)
                                var Crray = []
                                for (i = 0; i < Array.length; i++) {
                                    Crray.push([Array[i], Brray[i]])
                                }
                                if (Crray.length == Array.length) {
                                    let sq = `DELETE FROM image WHERE contentId = ${content}`
                                    con.query(sq, (error, results) => {
                                        if (error) {
                                            return resolve({ status: false, message: "image delete error", data: error })
                                        }
                                        if (results.length <= 0) {
                                            return resolve({ status: false, message: "not found content", data: error })
                                        }
                                        if (results) {
                                            var sql = `INSERT INTO image (imageName, contentId) VALUES ?`
                                            con.query(sql, [Crray], (error, result) => {
                                                if (error) {
                                                    return resolve({ status: false, message: error, data: error })
                                                }
                                                if (result) {
                                                    return resolve({ status: true, message: "ok", data: results })
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    } else {
                        var Array = data.array;
                        var Brray = [];
                        for (j = 0; j < Array.length; j++) {
                            Brray.push(content)
                        }
                        for (n = 0; n < data.file.length; n++) {
                            var filename = data.file[n].name
                            var mimetype = data.file[n].mimetype
                            const newFilename = generateString(8) + filename.split(" ").join("-");
                            const path = __dirname + "/image/" + newFilename

                            data.file[n].mv(path, (error) => {
                                if (error) {
                                    return resolve({ status: false, message: "image Upload fail in storage", data: null })
                                } else {
                                    Array.push(newFilename)
                                    Brray.push(content)
                                    if (Array.length == data.total) {
                                        var Crray = []
                                        for (i = 0; i < Array.length; i++) {
                                            Crray.push([Array[i], Brray[i]])
                                        }
                                        if (Crray.length == Array.length) {
                                            let sq = `DELETE FROM image WHERE contentId = ${content}`
                                            con.query(sq, (error, results) => {
                                                if (error) {
                                                    return resolve({ status: false, message: "image delete error", data: error })
                                                }
                                                if (results.length <= 0) {
                                                    return resolve({ status: false, message: "not found content", data: error })
                                                }
                                                if (results) {
                                                    var sql = `INSERT INTO image (imageName, contentId) VALUES ?`
                                                    con.query(sql, [Crray], (error, result) => {
                                                        if (error) {
                                                            return resolve({ status: false, message: error, data: error })
                                                        }
                                                        if (result) {
                                                            return resolve({ status: true, message: "ok", data: results })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    }
                                }
                            })
                        }
                    }
                }
                else {
                    return resolve({ status: false, message: "you are not User", data: error })
                }
            }
        })

    })
}

module.exports.delImag = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = "SELECT * FROM content WHERE id = '" + data.contentId + "'"
        con.query(sql, (error, results) => {
            if (error) {
                return resolve({ status: false, message: "error getting content", data: null })
            }
            if (results.length <= 0) {
                return resolve({ status: false, message: "not found content", data: error })
            }
            if (results) {
                if (results[0].userId == data.user.id) {
                    if (data.tag != undefined) {
                        var tag = data.arr
                        var cont = []
                        var usI = []
                        var tagg = []
                        for (i = 0; i < tag.length; i++) {
                            cont.push(content)
                            usI.push(data.user.id)
                            tagg.push([tag[i], cont[i], usI[i]])
                        }
                        if (tag.length == tagg.length) {
                            var sq = "INSERT INTO tagg (tagId, contentId, userId) VALUES ?"
                            con.query(sq, [tagg], (error, results) => {
                                if (error) {
                                    return resolve({ status: false, message: "tag error", data: null })
                                }
                            })
                        }
                    }
                    if (data.heading !== undefined) {
                        var sql = "UPDATE content SET heading = '" + data.heading + "' WHERE id = '" + data.contentId + "'"

                        con.query(sql, (error, result) => {
                            if (error) {
                                return resolve({ status: false, message: "error getting content", data: null })
                            }
                            if (result.length <= 0) {
                                return resolve({ status: false, message: "not found content", data: error })
                            } else if (result) {
                                return resolve({ status: true, message: "data Updated", data: result })
                            }
                        })
                    }
                    if (data.paragraph !== undefined) {
                        var sql = "UPDATE content SET paragraph = '" + data.paragraph + "' WHERE id = '" + data.contentId + "'"
                        con.query(sql, (error, result) => {
                            if (error) {
                                return resolve({ status: false, message: "error getting content", data: null })
                            }
                            if (result.length <= 0) {
                                return resolve({ status: false, message: "not found content", data: error })
                            } else if (result) {
                                return resolve({ status: false, message: "data Updated", data: result })
                            }
                        })
                    }
                    var content = data.contentId;
                    var Array = data.array;
                    var Brray = [];
                    if (Array.length == data.total) {
                        var Crray = []
                        for (i = 0; i < Array.length; i++) {
                            Brray.push(content)
                        }
                        if (Array.length == Brray.length) {
                            for (i = 0; i < Array.length; i++) {
                                Crray.push([Array[i], Brray[i]])
                            }
                            if (Crray.length == Array.length) {
                                let sq = `DELETE FROM image WHERE contentId = ${content}`
                                con.query(sq, (error, results) => {
                                    if (error) {
                                        return resolve({ status: false, message: "image delete error", data: error })
                                    }
                                    if (results.length <= 0) {
                                        return resolve({ status: false, message: "not found content", data: error })
                                    }
                                    if (results) {
                                        var sql = `INSERT INTO image (imageName, contentId) VALUES ?`
                                        con.query(sql, [Crray], (error, result) => {
                                            if (error) {
                                                return resolve({ status: false, message: error, data: error })
                                            }
                                            if (result) {
                                                return resolve({ status: true, message: "ok", data: results })
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    }
                } else {
                    return resolve({ status: false, message: "you are not User", data: error })
                }
            }
        })
    })
}

module.exports.userProfile = async (data) => {
    return new Promise((resolve, rejects) => {
        var sql = "SELECT r.*,c.* FROM register AS r LEFT JOIN "
        con.query(sql, (error, result) => {
            if (error) {
                return resolve({ status: false, message: "image Upload fail in db", data: error })
            }
            if (result) {
                return resolve({ status: true, message: "image Upload fail in db", data: result })
            }
        })
    })
}

module.exports.delData = async (data) => {
    return new Promise((resolve, rejects) => {
        var query = `SELECT * FROM content WHERE id = ${data.contentId}`
        con.query(query, (error, result) => {
            if (error) {
                return resolve({ status: false, message: "error of get content", data: error })
            }
            if (result[0].userId == data.user.id) {
                var sql = `DELETE FROM content WHERE id = ${data.contentId}`
                con.query(sql, (error, result) => {
                    if (error) {
                        return resolve({ status: false, message: "error", data: error })
                    }
                    if (result) {
                        return resolve({ status: true, message: "deleted", data: result })
                    }
                })
            } else {
                return resolve({ status: false, message: "you cant delete data of other user", data: null })
            }
        })
    })
}

module.exports.getData = async () => {
    return new Promise((resolve, rejects) => {
        var sql = `SELECT c.id AS contentId,c.heading AS heading,c.paragraph AS paragraph,c.catId AS category,r.id AS userId,r.name AS userName,r.email AS userEmail,r.mobile AS Number,r.address AS address,r.image AS userImage,i.imageName AS contentImage,(SELECT COUNT(*) FROM likes) AS totalLikes,(SELECT COUNT(*) FROM views) AS totalViews FROM content AS c LEFT JOIN register AS r ON r.id = c.userId LEFT JOIN image AS i ON i.contentId = c.id LEFT JOIN likes ON likes.contentId = c.id LEFT JOIN views ON views.contentId = c.id`
        con.query(sql, (error, result) => {
            if (error) {
                return resolve({ status: false, message: "error", data: error })
            }
            if (result) {
                return resolve({ status: true, message: "data Getted", data: result })
            }
        })
    })
}

module.exports.search = async (data) => {
    return new Promise((resolve, rejects) => {
        let sql = `SELECT c.id AS contentId,ct.name AS categoryName,c.heading,c.paragraph,c.createdAt AS createDate,GROUP_CONCAT(i.imageName) AS images ,GROUP_CONCAT(t.tagId) AS tagId,GROUP_CONCAT(tg.name) AS tagName,r.name AS creator,r.email,r.mobile,(SELECT COUNT(*) FROM likes WHERE likes.contentId = c.id) AS totalLikes,(SELECT COUNT(*) FROM views WHERE views.contentId = c.id) AS totalViews, c.updatedAt AS updateOn FROM content AS c LEFT JOIN cetegory AS ct ON ct.id = c.catId LEFT JOIN image AS i ON i.contentId = c.id LEFT JOIN tagg AS t ON t.contentId = c.id LEFT JOIN tag AS tg ON tg.id = t.tagId LEFT JOIN register AS r ON r.id = c.userId LEFT JOIN likes ON likes.contentId = c.id LEFT JOIN views ON views.contentId = c.id WHERE c.id = c.id `

        if (data.creatorId) {
            sql += `AND r.id = ${data.creatorId} `
        }
        if (data.contentId) {
            sql += `AND c.id = ${data.contentId} `
        }
        if (data.categoryId) {
            sql += `AND ct.id = ${data.categoryId} `
        }
        if (data.tagId) {
            sql += `AND tg.id = ${data.tagId} `
        }
        if (data.date) {
            sql += `AND c.createdAt LIKE '%${data.date}%' `
        }
        if (data.dateEnd) {
            sql += `AND c.createdAt < '${data.dateEnd}' `
        }
        if (data.dateStart) {
            sql += `AND c.createdAt > '${data.dateStart}' `
        }
        if (data.email) {
            sql += `AND r.email LIKE '%${data.email}%' `
        }
        if (data.search) {
            sql += `AND r.email LIKE '%${data.search}%' OR r.name LIKE '%${data.search}%' `
        }
        if (data.type == 1) {
            sql += `GROUP BY c.id ORDER BY (SELECT COUNT(*) FROM likes WHERE likes.contentId = c.id) DESC LIMIT ${data.limit} OFFSET ${data.offset} `
        } else if (data.type == 0) {
            sql += `GROUP BY c.id ORDER BY (SELECT COUNT(*) FROM views WHERE views.contentId = c.id) DESC LIMIT ${data.limit} OFFSET ${data.offset} `
        } else {
            sql += `GROUP BY c.id ORDER BY c.createdAt DESC LIMIT ${data.limit} OFFSET ${data.offset}`
        }
        con.query(sql, (error, result) => {
            console.log('sql: ', sql);
            if (error) {
                return resolve({ status: false, message: "error", data: error })
            }
            if (result) {
                return resolve({ status: true, message: "data Getted", data: result })
            }
        })
    })
}