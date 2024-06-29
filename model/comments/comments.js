const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
    user:{
       type:mongoose.Schema.Types.ObjectId,
       required:true
    },
    message:{
        type:String,
        required:true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Posts",
        required:true
    }
},{timestamps:true});

const Comments = mongoose.model("Comments",commentsSchema);

module.exports = Comments;