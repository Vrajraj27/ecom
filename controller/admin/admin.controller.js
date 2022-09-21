const bodyParser = require('body-parser');
const Validator = require('validatorjs');
const nodemailer = require('nodemailer');
const con = require('../../config/config');
const model = require('../../model/admin/admin.model');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const jwtSecret = "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df661109f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df661109f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611"
const { strictEqual } = require('assert');
const { error } = require('console');
const { request } = require('http');
const { response } = require('express');
const { id } = require('../../validator/validator');
const { getData } = require('../content/content.controller');
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
        const { name, email, password, mobile, address, image, otp } = request.body;
        const sql1 = 'SELECT * FROM register WHERE (email = "' + email + '" OR mobile ="' + mobile + '") AND admin = 1';
        con.query(sql1, async function (error, result) {
            if (result && result.length > 0) {
                return response.json({ status: true, message: "Admin already Exist", data: result });
            } else {
                var generatePassword = await bcrypt.hash(password, saltRounds);
                const txData = {
                    name: name,
                    email: email,
                    password: generatePassword,
                    mobile: mobile,
                    address: address,
                    image: image,
                    otp: otp,
                    varify: 1,
                    admin: 1
                };

                const addData = await model.register(txData);

                if (!addData.status) {
                    return response.json({ status: false, message: addData.message, data: null })
                } else {
                    return response.json({ status: true, message: "data added", data: txData });
                }
            }
        })
    }
    catch (e) {
        return response.status(500).json({ status: false, message: "Something Went To Wrong", data: null, });
    }
}

module.exports.adminLogin = async (request, response) => {
    try {
        const auth = request.body;
        let email = auth.email
        let password = auth.password
        var sql = 'SELECT * FROM register WHERE email = "' + email + '" AND admin = 1';
        console.log('sql: ', sql);
        con.query(sql, async (error, results) => {
            console.log('results: ', results);
            if (error) {
                return response.json({ status: false, message: "error in login", data: null })
            }
            if (results.length == 0) {
                return response.json({ status: false, message: "you are not admin", data: email })
            }
            if (results) {
                const data = {
                    email: email,
                    password: password
                }

                bcrypt.compare(password, results[0].password, function (error, result) {

                    if (error) {
                        return response.json({ status: false, message: "Password is incorrect", data: null });
                    }
                    if (result) {
                        var token = jwt.sign(JSON.stringify(results[0]), jwtSecret);
                        return response.json({ status: true, message: " Admin Login Successfully", data: result, token });
                    } else {
                        return response.json({ status: false, message: "Something is wrong", data: null });
                    }
                })
            }
        })
    } catch (error) {
        console.log('error: ', error);
        return response.status(500).json({ status: false, message: "Something Went Wrong", data: null, });
    }
}

module.exports.deleteUser = async (request, response) => {
    try {
        const auth = request.body
        let user = auth.user
        let id = auth.id
        const data = {
            user: user,
            id: id
        }

        const deleteData = await model.deleteUser(data);

        if (!deleteData.status) {
            return response.json({ status: deleteData.status, message: deleteData.message, data: null });
        }
        else if (deleteData.status) {
            return response.json({ status: deleteData.status, message: deleteData.message, data: deleteData });
        }
    } catch (error) {
        return response.status(500).json({ status: false, message: "Something Went Wrong", data: null, });
    }
}

module.exports.updateUser = async (request, response) => {
    try {
        const { id, name, email, mobile, address } = request.body
        let admin = request.body.user
        console.log('admin: ', admin);
        let file = request.files.image
        console.log('file: ', file);
        var filename = file.name
        console.log('filename: ', filename);
        var mimetype = file.mimetype
        console.log('mimetype: ', mimetype);
        const newFilename = generateString(8) + filename.split(" ").join("-");
        console.log('newFilename: ', newFilename);
        const path = __dirname + "/profile/" + newFilename
        console.log('path: ', path);
        file.mv(path, function (error) {
            console.log('path: ', path);
            if (error) {
                return resolve({ status: false, message: "image Upload fail in storage", data: null })
            }
        })
        console.log('admin: ', admin);
        const data = {
            id: id,
            name: name,
            email: email,
            mobile: mobile,
            address: address,
            image: newFilename,
        }

        var sql = "SELECT * FROM register WHERE id = '" + data.id + "'"
        console.log('sql: ', sql);
        console.log('data.email : ', data.email);
        con.query(sql, async (error, results) => {
            if (error) {
                return response.json({ status: false, message: "Something Went Wrong", data: null, })
            } else if (results.length == 0) {
                return response.json({ status: true, message: "enter valid data", data: results, })
            } else if (results[0].isDeleted == 1) {
                return response.json({ status: true, message: "user is deleted", data: results, })
            } else if (results) {
                const updateData = await model.updateUser(data);
                if (!updateData.status) {
                    return response.json({ status: updateData.status, message: updateData.message, data: null });
                }
                else if (updateData.status) {
                    return response.json({ status: updateData.status, message: updateData.message, data: updateData });
                }
            }
        })
    } catch (error) {
        return response.status(500).json({ status: false, message: "Something Went Wrong", data: null, });
    }
}

module.exports.getUsers = async (request, response) => {
    const { page } = request.query;
    var offset = (page - 1) * 10;
    var limit = 10

    const data = {
        page: page,
        limit: limit,
        offset: offset
    };

    getData = await model.getUsers(data);

    if (!getData.status) {
        return response.json({ status: getData.status, message: getData.message, data: null });
    }
    else if (getData.status) {
        return response.json({ status: getData.status, message: getData.message, data: getData.data });
    }
}

module.exports.getUser = async (request, response) => {
    const auth = request.query;
    let id = auth.id

    const data = {
        id: id
    };

    getData = await model.getUser(data);

    if (!getData.status) {
        return response.json({ status: getData.status, message: getData.message, data: null });
    }
    else if (getData.status) {
        return response.json({ status: getData.status, message: getData.message, data: getData.data });
    }
}

module.exports.deletedUsers = async (request, response) => {

    getData = await model.deletedUsers();

    if (!getData.status) {
        return response.json({ status: getData.status, message: getData.message, data: null });
    }
    else if (getData.status) {
        return response.json({ status: getData.status, message: getData.message, data: getData.data });
    }
}

module.exports.aproov = async (request, response) => {

    const auth = request.body;
    let id = auth.id

    const data = {
        id: id
    };

    const getData = await model.aproov(data);

    if (!getData.status) {
        return response.json({ status: getData.status, message: getData.message, data: getData.data });
    }
    else if (getData.status) {
        return response.json({ status: getData.status, message: getData.message, data: getData.data });
    }

}

module.exports.reject = async (request, response) => {

    const auth = request.body;
    let id = auth.id
    let message = auth.message
    const data = {
        id: id,
        message: message
    };

    const getData = await model.reject(data);
    if (!getData.status) {
        return response.json({ status: getData.status, message: getData.message, data: getData.data });
    }
    else if (getData.status) {
        return response.json({ status: getData.status, message: getData.message, data: getData.data });
    }
}

module.exports.rejectRes = async (request, response) => {

    const auth = request.query;
    let id = auth.id

    const data = {
        id: id
    };

    const getData = await model.rejectRes(data);
    if (!getData.status) {
        return response.json({ status: getData.status, message: getData.message, data: getData.data });
    }
    else if (getData.status) {
        return response.json({ status: getData.status, message: getData.message, data: getData.data });
    }
}

module.exports.requestBlk = async (request, response) => {

    const auth = request.body;
    let id = auth.id

    const data = {
        id: id
    };

    const getData = await model.requestBlk(data);
    if (!getData.status) {
        return response.json({ status: getData.status, message: getData.message, data: getData.data });
    }
    else if (getData.status) {
        return response.json({ status: getData.status, message: getData.message, data: getData.data });
    }
}

module.exports.adminReq = async (request, response) => {

    const auth = request.query;
    let id = auth.id
    let status = auth.status
    let search = auth.search
    let date = auth.date
    let startDate = auth.startDate
    let endDate = auth.endDate

    const data = {
        id: id,
        status: status,
        search: search,
        date: date,
        startDate: startDate,
        endDate: endDate
    };

    const getData = await model.adminReq(data);
    if (!getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: getData.data
        });
    }
    else if (getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: getData.data
        });
    }

}

module.exports.adminReqAll = async (request, response) => {

    const auth = request.query;
    let status = auth.status;

    const data = {
        status: status
    };

    const getData = await model.adminReqAll(data);

    if (!getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: getData.data
        });
    }
    else if (getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: getData.data
        });
    }

}

module.exports.setTime = async (request, response) => {

    const auth = request.body;
    let user = auth.user
    let time = auth.time
    const data = {
        user: user,
        time: time
    };

    const getData = await model.setTime(data);

    if (!getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: null
        });
    }
    else if (getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: getData.data
        });
    }

}

module.exports.setAllowreq = async (request, response) => {

    const auth = request.body;
    let user = auth.user
    let allow = auth.allow

    const data = {
        allow: allow,
        user: user
    };

    const getData = await model.setAllowreq(data);

    if (!getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: null
        });
    }
    else if (getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: getData.data
        });
    }

}

module.exports.sCategory = async (request, response) => {

    const auth = request.body;
    let user = auth.user
    let catId = auth.catId
    let name = auth.name

    const data = {
        user: user,
        catId: catId,
        name: name
    };

    const getData = await model.sCategory(data);

    if (!getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: null
        });
    }
    else if (getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: getData.data
        });
    }

}

module.exports.sCategoryUpd = async (request, response) => {

    const auth = request.body;
    let user = auth.user
    let id = auth.id
    let name = auth.name

    const data = {
        user: user,
        id: id,
        name: name
    };

    const getData = await model.sCategoryUpd(data);

    if (!getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: getData.data
        });
    }
    else if (getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: getData.data
        });
    }

}
module.exports.sCategoryDel = async (request, response) => {

    const auth = request.body;
    let user = auth.user
    let id = auth.id

    const data = {
        user: user,
        id: id
    }

    const getData = await model.sCategoryDel(data);

    if (!getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: null
        });
    }
    else if (getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: getData.data
        });
    }
}

module.exports.sCategoryGet = async (request, response) => {

    const auth = request.query;
    const use = request.body
    let user = use.user
    let id = auth.id

    const data = {
        user: user,
        id: id
    };

    const getData = await model.sCategoryGet(data);

    if (!getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: null
        });
    }
    else if (getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: getData.data
        });
    }

}
module.exports.sCategoryAll = async (request, response) => {

    const auth = request.body;
    let user = auth.user
    let catId = auth.catId
    let name = auth.name

    const data = {
        user: user,
    };

    const getData = await model.sCategoryAll(data);

    if (!getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: null
        });
    }
    else if (getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: getData.data
        });
    }

}
module.exports.tag = async (request, response) => {

    const auth = request.body;
    let user = auth.user
    let name = auth.name

    const data = {
        user: user,
        name: name
    };

    const getData = await model.tag(data);

    if (!getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: null
        });
    }
    else if (getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: getData.data
        });
    }

}

module.exports.tagdel = async (request, response) => {

    const auth = request.body;
    let user = auth.user
    let id = auth.id

    const data = {
        user: user,
        id: id
    };

    const getData = await model.tagdel(data);

    if (!getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: null
        });
    }
    else if (getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: getData.data
        });
    }

}

module.exports.tagUpd = async (request, response) => {

    const auth = request.body;
    let user = auth.user
    let name = auth.name
    let id = auth.id

    const data = {
        user: user,
        name: name,
        id: id
    };

    const getData = await model.tagUpd(data);

    if (!getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: null
        });
    }
    else if (getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: getData.data
        });
    }

}

module.exports.tagGet = async (request, response) => {

    const auth = request.body;
    let user = auth.user
    let id = auth.id

    const data = {
        user: user,
        id: id
    };

    const getData = await model.tagGet(data);

    if (!getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: null
        });
    }
    else if (getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: getData.data
        });
    }

}

module.exports.tagGetAll = async (request, response) => {

    const auth = request.body;
    let user = auth.user
    let name = auth.name

    const data = {
        user: user,
        name: name
    };

    const getData = await model.tagGetAll(data);

    if (!getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: null
        });
    }
    else if (getData.status) {
        return response.json({
            status: getData.status,
            message: getData.message,
            data: getData.data
        });
    }

}

module.exports.getProfiles = async (request, response) => {
    const { page } = request.query;
    var offset = (page - 1) * 10;
    var limit = 10

    const data = {
        page: page,
        limit: limit,
        offset: offset
    };

    const getData = await model.getProfiles(data);

    if (!getData.status) {
        return response.json({ status: getData.status, message: getData.message, data: null });
    }
    else if (getData.status) {
        return response.json({ status: getData.status, message: getData.message, data: getData });
    }
}