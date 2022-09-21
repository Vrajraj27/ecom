const multer = require('multer');
const bodyParser = require('body-parser');
const Validator = require('validatorjs');
const nodemailer = require('nodemailer');
const con = require('../../config/config');
const model = require('../../model/content/content.model');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const jwtSecret = "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611"
const { strictEqual } = require('assert');
const { error } = require('console');
const { request } = require('http');
const { response } = require('express');
const { type } = require('express/lib/response');

function generateString(length) {
    var result = '';
    var characters = '123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports.addData = async (request, response) => {
    try {
        let auth = request.body
        let user = auth.user
        let userId = user.id
        let catId = auth.catId
        let heading = auth.heading
        let para = auth.paragraph
        let file = request.files.image
        let tag = auth.tag
        let array = tag.split(",")

        var data = {
            userId: userId,
            catId: catId,
            heading: heading,
            paragraph: para,
            user: user,
            file: file,
            tag: tag,
            array: array
        }

        const addData = await model.addData(data);
        if (!addData.status) {
            return response.json({ status: false, message: addData.message, data: null })
        }
        if (addData.status) {
            const addDataa = await model.addDataa(data);
            if (!addDataa.status) {
                return response.json({ status: false, message: addDataa.message, data: null })
            }
            if (addDataa.status) {
                var content = {
                    con: addDataa.data
                }
                const adddDataa = await model.adddDataa(data, content);
                if (!adddDataa.status) {
                    return response.json({ status: false, message: adddDataa.message, data: adddDataa.data })
                }

                if (data.file.length === undefined) {
                    const adata = await model.adata(data, content);
                    if (!adata.status) {
                        return response.json({ status: false, message: adata.message, data: adata.data })
                    }
                    if (adata.status) {
                        return response.json({ status: true, message: adata.message, data: adata.data })
                    }
                } else {
                    const aadata = await model.aadata(data, content);
                    if (!aadata.status) {
                        return response.json({ status: false, message: aadata.message, data: aadata.data })
                    }
                    if (aadata.status) {
                        return response.json({ status: true, message: aadata.message, data: aadata.data })
                    }
                }
            }
        }
    } catch (e) {
        return response.json({ status: false, message: "Something went Wrong", data: null })
    }
}


module.exports.headingAll = async (request, response) => {
    try {
        const auth = request.query;
        let user = auth.user;
        var page = auth.page;
        var offset = (page - 1) * 10;
        var limit = 10
        var data = {
            page: page,
            limit: limit,
            offset: offset
        }

        const addData = await model.headingAll(data);
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

module.exports.heading = async (request, response) => {
    try {
        const auth = request.query;
        let user = auth.user;
        var data = {
            user: user
        }
        const addData = await model.heading(data);
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

module.exports.headingUpd = async (request, response) => {
    try {
        const auth = request.body;
        let user = auth.user;
        let id = auth.id;
        let heading = auth.heading
        var data = {
            user: user,
            id: id,
            heading: heading
        }
        addData = await model.headingUpd(data);
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

module.exports.get = async (request, response) => {
    try {
        const auth = request.query;
        let user = auth.user;
        let id = auth.id
        var data = {
            id: id
        }

        const addData = await model.get(data);
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


module.exports.like = async (request, response) => {
    try {
        const auth = request.body;
        let user = auth.user;
        let contentId = auth.contentId
        var data = {
            user: user,
            contentId: contentId
        }

        const addData = await model.like(data);
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

module.exports.dislike = async (request, response) => {
    try {
        const auth = request.body;
        let user = auth.user;
        let id = auth.id
        var data = {
            id: id,
            user: user
        }

        addData = await model.dislike(data);
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

module.exports.view = async (request, response) => {
    try {
        const auth = request.body;
        let user = auth.user;
        let contentId = auth.contentId
        var data = {
            user: user,
            contentId: contentId
        }

        addData = await model.view(data);
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

module.exports.cetegory = async (request, response) => {
    try {
        const auth = request.body;
        let user = auth.user;
        let name = auth.name
        var data = {
            user: user,
            name: name
        }

        addData = await model.cetegory(data);
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

module.exports.cetegoryGet = async (request, response) => {
    try {
        const auth = request.body;
        let user = auth.user;
        let id = auth.id
        var data = {
            user: user,
            id: id
        }

        addData = await model.cetegoryGet(data);

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

module.exports.cetegoryGetAll = async (request, response) => {
    try {
        const auth = request.body;
        let user = auth.user;
        let name = auth.name
        var data = {
            user: user
        }

        addData = await model.cetegoryGetAll(data);
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

module.exports.cetegoryUpdate = async (request, response) => {
    try {
        const auth = request.body;
        let user = auth.user;
        let name = auth.name;
        let id = auth.id
        var data = {
            user: user,
            name: name,
            id: id
        }

        addData = await model.cetegoryUpdate(data);
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

module.exports.cetegoryDel = async (request, response) => {
    try {
        const auth = request.body;
        let user = auth.user;
        let id = auth.id
        var data = {
            user: user,
            id: id
        }

        addData = await model.cetegoryDel(data);
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

module.exports.request = async (request, response) => {
    try {
        const auth = request.query;
        let user = request.body.user;
        var sql = "SELECT r.*, COUNT(l.contentId) AS totalLikes, COUNT(v.contentId) AS totalViews, ct.heading AS content FROM register AS r LEFT JOIN likes AS l ON r.id = l.userId LEFT JOIN views AS v ON r.id = v.userId LEFT JOIN content AS ct ON r.id = ct.userId WHERE r.id = '" + user.id + "'"

        con.query(sql, async (error, results) => {
            if (error) {
                return resolve({ status: false, message: "Some error in request", error, data: error })
            }
            if (results) {
                var data = {
                    user: user,
                }

                const addData = await model.request(data);
                if (!addData.status) {
                    return response.json({ status: false, message: addData.message, data: null })
                }
                if (addData.status) {
                    return response.json({ status: true, message: addData.message, data: addData.data })
                }
            }
        })

    } catch (e) {
        return response.json({ status: false, message: "Something went Wrong", data: null })
    }
}

module.exports.totalLike = async (request, response) => {
    try {
        const query = request.query;
        let auth = request.body
        let user = auth.user;

        var data = {
            user: user,
        }

        addData = await model.totalLike(data);
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

module.exports.totalView = async (request, response) => {
    try {
        const query = request.query;
        let auth = request.body
        let user = auth.user;

        var data = {
            user: user,
        }

        const addData = await model.totalView(data);

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

module.exports.inAllLike = async (request, response) => {
    try {
        const query = request.query;
        let auth = request.body
        let user = auth.user;
        var data = {
            user: user,
        }

        const addData = await model.inAllLike(data);
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

module.exports.tagAdd = async (request, response) => {
    try {
        const auth = request.body
        let user = auth.user;
        let contentId = auth.contentId
        let tagId = auth.tagId

        var data = {
            user: user,
            contentId: contentId,
            tagId: tagId
        }

        const addData = await model.tagAdd(data);
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

module.exports.tagGet = async (request, response) => {
    try {
        const query = request.query
        const auth = request.body
        let user = auth.user;

        var data = {
            user: user
        }

        addData = await model.tagGet(data);

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

module.exports.image = async (request, response, next) => {
    try {
        var auth = request.body;
        var user = auth.user;
        let file = request.files.image
        let id = auth.id

        let data = {
            user: user,
            file: file,
            id: id
        }

        const addData = await model.image(data);

        if (!addData.status) {
            return response.json({ status: false, message: addData.message, data: null })
        }
        if (addData.status) {
            return response.json({ status: true, message: addData.message, data: addData.data })
        }
    } catch (e) {
        return response.json({ status: false, message: "addData.message", data: null })
    }
}

module.exports.imageMulti = async (request, response, next) => {
    try {
        var auth = request.body;
        var image = auth.image
        if (image !== null) {
            var file = request.files.image
        }
        var user = auth.user;
        let id = auth.id
        let contentId = auth.contentId
        let array = id.split(",");

        let data = {
            user: user,
            file: file,
            id: id,
            array: array,
            contentId: contentId,
            image: image
        }

        const addData = await model.imageMulti(data);
        if (!addData.status) {
            return response.json({ status: false, message: addData.message, data: null })
        }
        if (addData.status) {
            return response.json({ status: true, message: addData.message, data: addData.data })
        }
    } catch (e) {
        return response.json({ status: false, message: "something went wrong", data: null })
    }
}

module.exports.ima = async (request, response, next) => {
    let auth = request.body
    let id = auth.id

    const data = {
        id: id,
    }

    const addData = await model.ima(data);

    if (!addData.status) {
        return response.json({ status: false, message: addData.message, data: null })
    }
    if (addData.status) {
        return response.json({ status: true, message: addData.message, data: addData.data })
    }
}


module.exports.delIma = async (request, response, next) => {
    try {
        if (request.files != null) {
            var auth = request.body;
            var file = request.files.image
            var user = auth.user;
            var heading = auth.heading
            var paragraph = auth.paragraph
            let imageName = auth.imageName
            let contentId = auth.contentId
            let tag = auth.tag
            let arr = tag.split(",")
            let array = imageName.split(",");
            let total = file.length + array.length

            let data = {
                user: user,
                file: file,
                imageName: imageName,
                array: array,
                contentId: contentId,
                total: total,
                paragraph: paragraph,
                heading: heading,
                arr: arr,
                tag: tag
            }

            const addData = await model.delIma(data);

            if (!addData.status) {
                return response.json({ status: false, message: addData.message, data: addData.data })
            }
            if (addData.status) {
                return response.json({ status: true, message: addData.message, data: addData.data })
            }
        }
        else {
            var auth = request.body;
            var user = auth.user
            let imageName = auth.imageName
            let contentId = auth.contentId
            let tag = auth.tag
            let arr = tag.split(",")
            let array = imageName.split(",");
            let total = array.length
            var paragraph = auth.paragraph
            var heading = auth.heading

            let data = {
                user: user,
                imageName: imageName,
                array: array,
                contentId: contentId,
                total: total,
                paragraph: paragraph,
                heading: heading,
                tag: tag,
                arr: arr
            }

            const addData = await model.delImag(data);

            if (!addData.status) {
                return response.json({ status: false, message: addData.message, data: null })
            }
            if (addData.status) {
                return response.json({ status: true, message: addData.message, data: addData.data })
            }
        }
    } catch (e) {
        return response.json({ status: false, message: "something went wrong", data: null })
    }
}

module.exports.userProfile = async (request, response, next) => {
    let auth = request.body
    let user = auth.user
    const data = {
        user: user
    }

    const addData = await model.userProfile(data);

    if (!addData.status) {
        return response.json({ status: false, message: addData.message, data: null })
    }
    if (addData.status) {
        return response.json({ status: true, message: addData.message, data: addData.data })
    }
}

module.exports.delData = async (request, response, next) => {
    let auth = request.body
    let contentId = auth.contentId
    let user = auth.user

    const data = {
        contentId: contentId,
        user: user
    }

    const addData = await model.delData(data);

    if (!addData.status) {
        return response.json({ status: false, message: addData.message, data: addData.data })
    }
    if (addData.status) {
        return response.json({ status: true, message: addData.message, data: addData.data })
    }
}

module.exports.getData = async (request, response, next) => {
    let auth = request.body

    const addData = await model.getData();

    if (!addData.status) {
        return response.json({ status: false, message: addData.message, data: null })
    }
    if (addData.status) {
        return response.json({
            status: true, message: addData.message, data: addData.data
        })
    }
}

module.exports.search = async (request, response, next) => {
    let auth = request.query
    var contentId = auth.contentId
    var creatorId = auth.creatorId
    var categoryId = auth.categoryId
    var tagId = tagId
    var dateStart = auth.dateStart
    var dateEnd = auth.dateEnd
    var email = auth.email
    var search = auth.search
    var page = auth.page
    var offset = (page - 1) * 25;
    var limit = 25;
    var type = auth.type

    const data = {
        contentId: contentId,
        creatorId: creatorId,
        categoryId: categoryId,
        dateStart: dateStart,
        tagId: tagId,
        dateEnd: dateEnd,
        email: email,
        search: search,
        offset: offset,
        limit: limit,
        page: page,
        type: type
    }

    const addData = await model.search(data);

    if (!addData.status) {
        return response.json({ status: false, message: addData.message, data: addData.data })
    }
    if (addData.status) {
        return response.json({
            status: true, message: addData.message, data: addData.data
        })
    }
}