require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");

//cloudinary congiguration.......
cloudinary.config({
    api_key:process.env.CLOUDINARY_KEY,
    cloud_name:process.env.CLOUDINARY_NAME,
    api_secret:process.env.CLOUDINARY_SECRET
})

//multer storage configuration 
const storage  = new CloudinaryStorage({
    cloudinary,
    allowedFormats:["jpeg","jpg","png"],
    params:{
        folder:"blog-app",
        transformation: [{width:"500",height:"500",crop:"limit"}]
    }
});
module.exports = storage;