const express= require('express');
const multer = require("multer");
const {
    createPostCtrl,
    getAllPostsCtrl,
    getPostCtrl,
    updatePostCtrl,
    deletePostCtrl
} = require("../../controller/posts/postsController");
const protected = require("../../middlewares/protected");
const storage = require("../../config/cloudinary");
const Posts = require('../../model/posts/posts');

const postsRouter = express.Router();

//instance of multer 
const upload = multer({storage});


//rendering the create post form 
postsRouter.get("/create-post-form",protected,(req,res)=>{
res.render("posts/addPost",{error:""});
});

//rendering and populating the update password form
postsRouter.get("/update-post-form/:id" ,async(req, res)=>{
      try {
         const post = await Posts.findById(req.params.id);
         res.render("posts/updatePost",{post,error:""})
      } catch (error) {
        res.render("post/updatePost",{
            error:error.message,
            post:""
        })
      }
})


//post /api/v1/posts
postsRouter.post("",protected,upload.single("file"),createPostCtrl);

//get /api/v1/posts
postsRouter.get("",getAllPostsCtrl);

//get /api/v1/posts/:id
postsRouter.get("/:id",getPostCtrl);

//put /api/v1/posts/:id
postsRouter.put("/:id",protected, upload.single("file"),updatePostCtrl);

//delete /api/v1/posts/:id
postsRouter.delete("/:id",protected,deletePostCtrl);

module.exports = postsRouter;

