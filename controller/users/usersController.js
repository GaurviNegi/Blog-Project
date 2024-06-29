//register function
const bcryptjs = require("bcryptjs");
const Users = require("../../model/users/users");
const appErr = require("../../utils/appError");


const registerCtrl = async(req, res,next)=>{
    const {fullname, email , password, role, about} = req.body;
   
    //check if user has given all the required fields
    if(!fullname || !email || !password ||!role ||!about){
       return res.render("users/register",{error:"All fields are required"});
    }

    //check for user existence
    const isPresent = await Users.findOne({email});
    try {
        if(isPresent){
           return res.render("users/register",{error:"User already registered"});
        }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password,salt)
    console.log(typeof hashedPassword);
       const user = await Users.create(
        {   fullname,
            email,
            password:hashedPassword,
            role,
            about
        })
        
        //redirecting ...........
      res.redirect('/api/v1/users/login');

    } catch (error) {
      return res.render("users/register",{error:error.message})
    }
}

//login function 
const loginCtrl = async(req, res,next)=>{
    const {email , password } = req.body;
 
   // check for all the fields provided
    if(!email || !password){
       return res.render("users/login",{error:"All fields are required"})
    }

    try {
    const userFound = await Users.findOne({email});
    //check if user exists
    if(!userFound){
       return res.render("users/login",{error:"Invalid Login Credentials"})
    }
    
    //check passwords
    const isPasswordValid = await bcryptjs.compare(password,userFound.password)
    if(!isPasswordValid){
       return res.render("users/login",{error:"Invalid Login Credentials"})
     }
    
     //adding userFound id to the session
     req.session.userAuth = userFound._id;
     console.log(userFound._id)
    
     //redirecting ...........
     res.redirect('/api/v1/users/profile-page');
    
    } catch (error) {
      return res.render("users/login",{error:error.message});
    }
}


//logout function 
const logoutCtrl = async(req, res)=>{
    try {
      req.session.destroy(()=>{
        res.redirect("/api/v1/users/login");
      })
    } catch (error) {
       res.next(appErr(error.message));
    }
}

//function to get the single user 
const getUserCtrl = async(req, res)=>{
    const userId = req.params.id;
    const user = await Users.findOne({_id:userId});
    try {
       res.render('users/updateUser',{
        user,
        error:""
       });
    } catch (error) {
        return res.render('users/updateUser',{
          error:error.message,
          user:""
         });
    }
}

//function to get the profile of user 
const getProfileCtrl = async(req, res)=>{
    const userId = req.session.userAuth;
    
    try {
      const user = await Users.findOne({_id:userId}).populate('posts').populate("comments");
      
      //rendering the page 
     res.render("users/profile-page",{user});
    } catch (error) { 
        res.json(error)
    }
}

//function to upload profile photo 
const uploadProfilePhotoCtrl = async(req, res ,next)=>{
    try{
      if(!req.file){
        return res.render("users/uploadProfilePhoto",{error:"PLease upload file first"})
      }
        //getting user id from the session
    const userId = req.session.userAuth;
  
    const userFound= await Users.findById(userId);

    //if user not exists
    if(!userFound){
        return res.redirect("users/uploadProfilePhoto",{error:"user not exists"})
    }
    //if user exists
    await Users.findByIdAndUpdate(userId,{
        profileImage:req.file.path
    },
    {
        new:true
    }
    );
    //redirecting to profile page
    res.redirect("/api/v1/users/profile-page"); 
    }
     catch (error) {
      return res.render("users/uploadProfilePhoto",{
        error:error.message
      });
    }
}

//function to upload cover photo
const uploadCoverPhotoCtrl = async(req, res,next)=>{
  
    try {
      if(!req.file){
         return res.render('users/uploadCoverPhoto',{error:"Please upload file first"});
      }
        //fetching for teh user
      const userId = req.session.userAuth;
      const userFound = await Users.findById(userId); 
      //if user not exists
    if(!userFound){
      return res.redirect("users/uploadCoverPhoto",{error:"user not exists"})
  }

      //uploading the cover photo if user exists 
      await Users.findByIdAndUpdate(userId,{
        coverImage:req.file.path
      },
      {new:true})
      
     //redirecting to the profile page 
     res.redirect("/api/v1/users/profile-page");
    } 
    catch (error) {
      return res.render("users/uploadProfilePhoto",{
        error:error.message
      });
    }
}

//function to update password
const updatePasswordCtrl = async(req, res , next)=>{
    const {password} = req.body;
    try {
        //checking if user is updating a password 
        if(!password){
          return res.render("users/updatePassword",{error:"Password field is required"});
        }
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(password,salt);
            //updating the password
            await Users.findByIdAndUpdate(req.session.userAuth,{password:hashedPassword},{new:true});

           //redirecting 
           res.redirect("/api/v1/users/profile-page");
   }
   catch (error) {
      return res.render("users/updatePassword",{
      error:error.message
     });
    }
  }

//function to update user details
const updateUserCtrl  =async(req, res, next)=>{
    const {fullname , email} = req.body;

    try {
      if(!fullname || !email){
        return res.render('users/updateUser',{
          user:"",
          error:'All fields are required'
        });
      }
     
        const emailTaken = await Users.findOne({email}); 
        if(emailTaken){
          return res.render('users/updateUser',{
            user:"",
            error:'email has been taken'
          });
        }
      
     
      //update user 
    await Users.findByIdAndUpdate(req.session.userAuth,{
        fullname,
        email
    },{new:true})
    
     res.redirect("/api/v1/users/profile-page");
    } catch (error) {
       return res.render("users/updateUser",{
        user:"",
        error:error.message
       });
    }
}

module.exports = {
    registerCtrl,
    loginCtrl,
    logoutCtrl,
    getUserCtrl,
    getProfileCtrl,
    uploadProfilePhotoCtrl,
    uploadCoverPhotoCtrl,
    updatePasswordCtrl,
    updateUserCtrl
}