# ecom

# controller{

                // const sql2 = 'SELECT mobile FROM register WHERE mobile ="' + mobile + '"';
                // console.log('sql2: ', sql2);
                // con.query(sql2, async function (error, result) {
                //     console.log('result: ', result);

                //     if (result == null) {
                //         return response.json({
                //             status: true,
                //             message: "User already Exist",
                //             data: null
                //         });
                //     } else if (result && result.length > 0) {
                //         return response.json({
                //             status: true,
                //             message: "User already Exist",
                //             data: null
                //         });
                //     } else {

                //     }
                // })
                //     }

                // })
                // try {
                // if (request.method == "POST") {
                //     body('name').notEmpty(),
                //         body('email').isEmail().normalizeEmail(),
                //         body('password').isLength({ min: 8 }),
                //         body('mobile').isMobilePhone(),
                //         body('address').notEmpty(),
                //         body('image').notEmpty()
                // }


        // } catch (e) {
        //     return response.status(500).json({
        //         status: false,
        //         message: "Something Went To Wrong",
        //         data: null,
        //     });

        // }
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

login:

                // const txData = {
                //     email: email,
                //     password: password,
                // };

                // const addData = await model.login(txData);

                // if (!(addData.status || addData.results.status)) {
                //     return response.json({
                //         status: false,
                //         message: addData.message,
                //         data: null
                //     })
                // }

                // var email = email;


                        // const token = generateAccessToken({ email: request.body.email });
                        // function authenticateToken(request, response, next) {
                        //     const authHeader = request.headers['authorization']
                        //     const token = authHeader && authHeader.split(' ')[1]

                        //     if (token == null) {
                        //         return response.json({
                        //             status: false,
                        //             message: "Token is null",
                        //             data: null
                        //         })
                        //     }

                        //     jwt.verify(token, process.env.TOKEN_SECRET, (err, result) => {
                        //         if (err) {
                        //             return response.json({
                        //                 status: false,
                        //                 message: "Token Not Verify",
                        //                 data: null
                        //             })
                        //         }
                        //         request.email = email
                        //         next()
                        //     })
                        // }

                        // var id = addData.data[0].id;
                        // console.log('id: ', id);
                        // var email = addData.data[0].email;
                        // console.log('email: ', email);
                        // var admin = addData.data[0].admin
                        // console.log('admin: ', admin);


                        // var token = jwt.sign(JSON.stringify(), jwtSecret, { expiresIn: '2h' });
                        // response.cookie("jwt", token, { httpOnly: true, maxAge: 120000 * 60 });

                        // jwt.verify(token, jwtSecret, (err, result) => {
                        //     if (err) {
                        //         return response.json({
                        //             status: false,
                        //             message: "Token Not Verify",
                        //             data: null
                        //         })
                        //     }
                        //     if (result) {
                        //     }
                        // })










    // try {
    //     var img = request.files;
    //     let image = img.image;
    //     var filename = image.name;
    //     var mimetype = image.mimetype
    //     var newFilename = generateString(8) + filename.split(" ").join("-");

    //     var upload = {
    //         newFilename: newFilename,
    //         mimetype: mimetype,
    //         image: image
    //     }
    //     const addData = await model.image(upload);

    //     if (!addData.status) {
    //         return response.json({
    //             status: false,
    //             message: addData.message,
    //             data: null
    //         })
    //     }
    //     if (addData.status) {
    //         return response.json({
    //             status: true,
    //             message: addData.message,
    //             data: addData.data
    //         })
    //     }
    // }
    // catch (e) {
    //     return response.json({
    //         status: false,
    //         message: "error",
    //         data: null
    //     })
    // }




                //     if (request.method == "POST") {
                //         console.log('email: ', email);

                //         body(email).isEmail().normalizeEmail(),
                //             body(password).isLength({ min: 8 })
                //         console.log('password: ', password);
                //     }



                // const addData = await model.adminLogin(data);
                // console.log('addData: ', addData);

                // if (!addData.status) {
                //     return response.json({
                //         status: addData.status,
                //         message: addData.message,
                //         data: null
                //     })
                // }
                // console.log('addData', addData);





                        // response.cookie("jwt", token, { httpOnly: true, maxAge: 10800 * 1000 });

                        // jwt.verify(token, jwtSecret, (err, result) => {
                        // if (err) {
                        //     return response.json({
                        //         status: false,
                        //         message: "Token Not Verify",
                        //         data: null
                        //     })
                        // }
                        // if (result) {

}

model:{

// else if (data.reject == 1) {
// var sql = ` SELECT r.userId AS userId,r.likes AS likes,r.views AS views,r.aproove AS aproove, r.reject AS reject,r.message AS message,r.block AS block,re.name AS name,re.email AS email,re.mobile AS mobile,re.address AS address,re.image AS image FROM request AS r LEFT JOIN register AS re ON re.id = r.userId WHERE r.reject = ${data.reject}`;
// console.log('sql: ', sql);

// con.query(sql, (error, results) => {
// console.log('results: ', results);
// if (error) {
// return resolve({
// status: false,
// message: "error on get",
// data: results
// })
// } else if (results.length <= 0) {
// return resolve({
// status: true,
// message: "no user available",
// data: results
// })
// }
// else if (results) {
// return resolve({
// status: true,
// message: "user requested",
// data: results
// })
// }
// })
// } else {
// var sql = ` SELECT r.userId AS userId,r.likes AS likes,r.views AS views,r.aproove AS aproove, r.reject AS reject,r.message AS message,r.block AS block,re.name AS name,re.email AS email,re.mobile AS mobile,re.address AS address,re.image AS image FROM request AS r LEFT JOIN register AS re ON re.id = r.userId`;
// console.log('sql: ', sql);

// con.query(sql, (error, results) => {
// console.log('results: ', results);
// if (error) {
// return resolve({
// status: false,
// message: "error on get",
// data: results
// })
// } else if (results) {
// return resolve({
// status: true,
// message: "user requested",
// data: results
// })
// }
// })
// }
// })
// }
}

QUERY FOR SPECIFIC CONTENT BY ID :
`SELECT c.id AS contentId, c.catId AS categoryId,ct.name AS categoryName,c.heading,c.paragraph,c.createdAt AS createDate,GROUP_CONCAT(i.imageName) AS images ,GROUP_CONCAT(t.tagId) AS tagId,GROUP_CONCAT(tg.name) AS tagName,r.name AS creator,r.email,r.mobile,(SELECT COUNT(*) FROM likes WHERE likes.contentId = c.id) AS totalLikes,(SELECT COUNT(*) FROM views WHERE views.contentId = c.id) AS totalViews FROM content AS c LEFT JOIN cetegory AS ct ON ct.id = c.catId LEFT JOIN image AS i ON i.contentId = c.id LEFT JOIN tagg AS t ON t.contentId = c.id LEFT JOIN tag AS tg ON tg.id = t.tagId LEFT JOIN register AS r ON r.id = c.userId LEFT JOIN likes ON likes.contentId = c.id LEFT JOIN views ON views.contentId = c.id WHERE c.id = `;
