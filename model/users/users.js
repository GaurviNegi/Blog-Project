const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname :{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  role:{
    type:String,
    required:true
  },
  about:{
    type:String,
    required:true
  },
  profileImage:{
    type:String,
    default:"https://res.cloudinary.com/dawed6sz8/image/upload/v1712079210/icon-1633249_640_plvbfg.png"
  },
  coverImage:{
    type:String,
    default:"https://res.cloudinary.com/dawed6sz8/image/upload/v1712080709/download_p4wyfk.png"
  },

  posts : [{type:mongoose.Schema.Types.ObjectId, ref:"Posts"}],

  comments : [{type:mongoose.Schema.Types.ObjectId, ref:"Comments"}] 
},
{
    timestamps:true,
})

const Users = mongoose.model("Users",userSchema);
module.exports= Users;