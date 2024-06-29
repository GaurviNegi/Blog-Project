const Comments = require("../../model/comments/comments");
const Posts = require('../../model/posts/posts');
const Users = require("../../model/users/users");
const appErr = require("../../utils/appError");
//function to create the comments
const createCommentCtrl = async(req, res,next)=>{
    const {message} = req.body;

    try {
        if(!message){
            return next(appErr("message field for the comment is required"));
        }
        //finding the post
        const post = await Posts.findById(req.params.id);
        if(!post){
            return next(appErr("post not found"),404)
        }
        //finding the user 
        const user = await Users.findById(req.session.userAuth);
        //creating the comment 
        const comment = await Comments.create({
           user:req.session.userAuth,
           message,
           post:post._id
        });

        //adding the comment to User and Post Collection
        post.comments.push(comment._id);
        user.comments.push(comment._id); 
        
        //saving the changes 
        await post.save({validateBeforeSave:false});
        await user.save({validateBeforeSave:false});
        //sending the response
       res.redirect(`/api/v1/posts/${post._id}`)
    } catch (error) {
        return next(appErr(error.message));
    }
}

//function to get specific comment 
const getCommentCtrl = async(req, res,next)=>{

    try {
        const comment = await Comments.findById(req.params.id);
        
        if(!comment){
            return res.render("comments/updateComment",{
                error:"comment not found",
                comment:""
            });
           
        }

        //rendering the comment update form 
       res.render("comments/updateComment",{
        comment,
        error:""
       });

    } catch (error) {
        return res.render("comments/updateComment",{
            error:error.message,
            comment:""
        });
    }
}

//function to update the Comment 
const updateCommentCtrl = async(req, res,next)=>{
    try {
        const {message} = req.body;
        console.log(message)
         //find the comment 
         const comment = await Comments.findById(req.params.id);
         if(!message){
            return res.render("comments/updateComment",{
                error:"Message field is required",
                comment:""
            });
        }
         //check for unauthorized user
         if(comment.user.toString() !== req.session.userAuth.toString()){
            return res.render("comments/updateComment",{
                error:"you are npt authorize dto update this comment",
                comment:""
            });
         }
 
         //if authorized --> updating the comment 
         await Comments.findByIdAndUpdate(req.params.id,{
            message 
         },
         {new:true}
         )
         //sending back the response  by rendering the post Detail page
         res.redirect(`/api/v1/posts/${comment.post}`)
          
    } catch (error) {
        return res.render("comments/updateComment",{
            error:error.message,
            comment:""
        });
    }
}

//function to delete the comment 
const deleteCommentCtrl = async(req, res,next)=>{
    const id = req.params.id;
    try {
        const comment = await Comments.findById(id);
        if(!comment){
            return next(appErr("comment not found"),404)
        }
        if(comment.user.toString() !== req.session.userAuth.toString()){
            return next(appErr("unauthorized user"),403);
        }
        //deleting the comment
        await Comments.findByIdAndDelete(id);
       
        res.redirect(`/api/v1/posts/${req.query.postId}`)
        } 
        catch (error) {
        return next(appErr(error.message));
    }
}

module.exports = {
    createCommentCtrl,
    getCommentCtrl,
    updateCommentCtrl,
    deleteCommentCtrl
}