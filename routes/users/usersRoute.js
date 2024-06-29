const express  = require("express");
const multer = require("multer");
const storage  = require("../../config/cloudinary");
const {
    registerCtrl,
    loginCtrl,
    logoutCtrl,
    getUserCtrl,
    getProfileCtrl,
    uploadProfilePhotoCtrl,
    uploadCoverPhotoCtrl,
    updatePasswordCtrl,
    updateUserCtrl
} = require("../../controller/users/usersController")
const protected = require("../../middlewares/protected");

const usersRouter = express.Router();
const upload = multer({storage});

//rendering login form 
usersRouter.get("/login",(req, res)=>{
   res.render("users/login",{error:''});
}); 
//rendering register form 
usersRouter.get("/register",(req, res)=>{
    res.render("users/register",{error:''});
 }); 


 //rendering the profile-photo-update-form 
 usersRouter.get("/profile-photo-upload-form",(req, res)=>{
    res.render("users/uploadProfilePhoto",{error:""});
 }); 
 //rendering the cover-photo-update-form 
 usersRouter.get("/cover-photo-upload-form",(req, res)=>{
    res.render("users/uploadCoverPhoto",{error:""});
 }); 
 
 //rendering update user password form 
 usersRouter.get("/update-user-password-form",(req, res)=>{
    res.render("users/updatePassword",{error:""});
 });


//post /api/v1/users/register
usersRouter.post("/register",registerCtrl)

//post /api/v1/users/login
usersRouter.post("/login",loginCtrl)

//get /api/v1/users/logout
usersRouter.get("/logout",logoutCtrl)

//get /api/v1/users/profile/:id
usersRouter.get("/profile-page",protected,getProfileCtrl)


//put /api/v1/users/profile-photo-upload/:id 
usersRouter.put("/profile-photo-upload", protected, upload.single("profile"),uploadProfilePhotoCtrl)

//put /api/v1/users/cover-photo-upload/:id
usersRouter.put("/cover-photo-upload",protected ,  upload.single("cover"),uploadCoverPhotoCtrl)

//put /api/v1/users/update-password/:id
usersRouter.put("/update-password",updatePasswordCtrl)

//put /api/v1/users/update/:id
usersRouter.put("/update",updateUserCtrl)

//get /api/v1/users/:id
usersRouter.get("/:id",getUserCtrl)

module.exports = usersRouter;