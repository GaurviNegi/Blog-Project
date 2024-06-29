const mongoose = require("mongoose");

const postsSchema  = new mongoose.Schema({
    title:{
      type:String,
      required:true
    },
    description:{
      type:String,
      required:true
    },
    category:{
      type:String,
      required:true,
      enum:["Web Development","Artificial Intelligence","Cloud Computing", "Cyber Security" ,"Android Development","Data Structures","Blockchain","other"]
    },
    image:{
        type:String,
        required:true
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },

    comments:[{type:mongoose.Schema.Types.ObjectId,ref:"Comments"}]
},{timestamps:true});

const Posts = mongoose.model("Posts",postsSchema);

module.exports = Posts;