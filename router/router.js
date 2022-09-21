var express = require('express');
require('dotenv').config()
var router = express.Router();
const jwt = require('jsonwebtoken');
const validator = require("../validator/validator");
const controller = require("../controller/controller");
const admin = require("../controller/admin/admin.controller");
const content = require("../controller/content/content.controller");

//register
router.post("/register", validator.signup, controller.register);

//varify Email
router.put("/varify", validator.varify, controller.varifiy);

//userLogin
router.post("/login", validator.login, controller.login);

// forgot Password
router.post("/forget", validator.forget, validator.token, controller.forget);
router.put("/forgetupdate", validator.forgetUpdate, validator.token, controller.forgetUdt);

// Update password
router.put("/changepass", validator.changePass, validator.token, controller.changePassword);

// Update Email
router.put("/updateemail", validator.forget, validator.token, controller.updateEmail);
router.put("/updateemail/varify", validator.updateEmail, validator.token, controller.updateEmailVarify);

//delete profile
router.delete("/deleteprofile", validator.token, controller.deleteProfile);
//update profile
router.put("/updateprofile", validator.token, controller.updateProfile);
//get profile
router.get("/getprofile", validator.token, controller.getProfile);

router.post("/admin/register", admin.register);
router.post("/admin/login", validator.adminlogin, admin.adminLogin);

// search
router.get("/profile", controller.profile);
// Admin side user control
router.get("/admin/getprofiles", validator.page, validator.token, admin.getProfiles);
router.delete("/admin/deleteuser", validator.delUser, validator.token, admin.deleteUser);
router.put("/admin/updateuser", validator.updateUser, validator.token, admin.updateUser);
router.get("/admin/getuser", validator.token, admin.getUser); // by perticular id
// all users list
router.get("/admin/getusers", validator.page, validator.token, admin.getUsers);
// deleted list of user
router.get("/admin/deleteduser", validator.token, admin.deletedUsers);

//content Add Delete
router.post("/content/add", validator.token, content.addData);
router.put("/content/update", validator.token, content.delIma);
router.delete("/content/delete", validator.delCon, validator.token, content.delData);
router.get("/content/getall", validator.token, content.getData);
router.get("/content/get", validator.id, validator.token, content.get); // get content detail

router.get("/content/getheading", validator.page, validator.token, content.headingAll);
router.get("/content/heading", validator.token, content.heading);
router.put("/content/heading", validator.head, validator.token, content.headingUpd);
// router.delete("/content/heading", validator.token, content.headingDlt);
// router.get("/content/heading", validator.token, content.heading);
// router.get("/content/heading", validator.token, content.heading);

router.put("/content/like", validator.idc, validator.token, content.like);

router.put("/content/view", validator.idc, validator.token, content.view);

router.post("/content/cetegory", validator.cate, validator.token, content.cetegory);
router.get("/content/cetegoryall", validator.token, content.cetegoryGetAll);
router.get("/content/cetegory", validator.delUser, validator.token, content.cetegoryGet);
router.put("/content/cetegory", validator.categ, validator.token, content.cetegoryUpdate);
router.delete("/content/cetegory", validator.delUser, validator.token, content.cetegoryDel);

router.post("/admin/tag", validator.cate, validator.token, admin.tag);
router.put("/admin/tag", validator.categ, validator.token, admin.tagUpd);
router.get("/admin/tag", validator.delUser, validator.token, admin.tagGet);
router.get("/admin/tagall", validator.token, admin.tagGetAll);
router.delete("/admin/tag", validator.delUser, validator.token, admin.tagdel);
// router.get("/content/tagGet", validator.token, content.tagGet);
// router.post("/content/tagAdd", validator.token, content.tagAdd);

router.get("/content/request", validator.token, content.request);
router.put("/admin/aproove", validator.delUser, validator.token, admin.aproov);
router.put("/admin/reject", validator.reje, validator.token, admin.reject);
router.get("/admin/rejectres", validator.deser, validator.token, admin.rejectRes);
router.put("/admin/requestblk", validator.delUser, validator.token, admin.requestBlk);

//Admin search
router.get("/admin/adminreq", validator.token, admin.adminReq);
// admin Search request by status 
router.get("/admin/adminreqall", validator.status, validator.token, admin.adminReqAll);

//LIKES and VIEWS
router.get("/admin/totalLike", validator.token, content.totalLike);
router.get("/admin/totalView", validator.token, content.totalView);
router.get("/admin/inAllLike", validator.token, content.inAllLike);

// SET TIME FOR NEXT REQUEST GAP TIME
router.put("/admin/setTime", validator.time, validator.token, admin.setTime);
// SET NUMBER OF REQUEST USER SEND
router.put("/admin/setAllowreq", validator.allow, validator.token, admin.setAllowreq);

router.post("/admin/scategory", validator.subc, validator.token, admin.sCategory);
router.put("/admin/scategory", validator.categ, validator.token, admin.sCategoryUpd);
router.delete("/admin/scategory", validator.delUser, validator.token, admin.sCategoryDel);
router.get("/admin/scategory", validator.delUser, validator.token, admin.sCategoryGet);
router.get("/admin/scategoryall", validator.token, admin.sCategoryAll);

router.put("/content/image/update", validator.token, content.image);

router.put("/content/image/updateMulti", validator.token, content.imageMulti);

router.put("/content/ima", content.ima);

router.put("/content/like", validator.token, content.like);

router.get("/content/user/profile", validator.token, content.userProfile);

router.get("/content/search", validator.token, content.search)

module.exports = router;