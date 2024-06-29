const Posts = require("../../model/posts/posts");
const Users = require("../../model/users/users");
const appErr = require("../../utils/appError");

//function to create posts
const createPostCtrl = async(req, res,next)=>{
    //getting data from the request 

    const {title, description , category, user} = req.body;
    try {
        if(!title || !description || !category || !req.file){
            return res.render("posts/addPost",{error:"All fields are required"});
        }
        
        //fetching user 
        const userId = req.session.userAuth; 
        const userFound = await Users.findById(userId);
        //creating new post
        const newPost = await Posts.create({
            title,
            description,
            category,
            user:userFound._id,
            image:req.file.path
        })
        
        //pushing the post into the user collection
        userFound.posts.push(newPost._id);
        await userFound.save();
        res.redirect(`/api/v1/posts/${newPost._id}`);
    } catch (error) {
        return res.render("posts/addPost",{error:error.message});
    }
}

//function to see all the posts 
const getAllPostsCtrl = async(req, res,next)=>{
    try {
        const posts  = await Posts.find({}).populate("comments");
        
        res.json({
            status:"successfull",
            message:" all posts listed",
            data:posts
        });
    } catch (error) {
        return next(appErr(error.message));
    }
}

//function to specific post 
const getPostCtrl = async(req, res,next)=>{
    const id  = req.params.id;
    try {
        const post =await Posts.findById(id).populate({
            path:'comments',
            populate:{
                path:'user',
                model:'Users'
            }
        }).populate("user");

        const similarPosts = await Posts.find({category:post.category,_id:{$ne:post._id}});
        res.render("posts/postDetails",{
            post,
            error:"",
            similarPosts
        });
    } catch (error) {
       return next(appErr(error.message))
    }
}

//function to update a post 
const updatePostCtrl =async(req, res,next)=>{
    //get the user input
    const {title , description , category}  = req.body;
    const id = req.params.id
    try {
        if(!title || !description || !category){
            return res.render("posts/updatePost",{
                post:"",
                error:"All fields are required"
            })
        }
        //find the post 
        const post = await Posts.findById(id);
        //check for unauthorized user
        if(post.user.toString() !== req.session.userAuth.toString()){
            return res.render("posts/updatePost",{
                post:"",
                error:"you are not authorized to update the post"
            })
        }

        //if authorized --> updating the post 
        if(req.file){
        await Posts.findByIdAndUpdate(id,{
            title,
            description,
            category,
            image:req.file.path
        },
        {new:true}
        )
        }else{
            await Posts.findByIdAndUpdate(id,{
                title,
                description,
                category,
            },
            {new:true}
            ) 
        }
       
        //rendering the home page 
        res.redirect("/");
    } 
    catch (error) {
    //error 
      return res.render("posts/updatePost",{
        error:error.message,
        post:""
      });
    }
}

//function to delete a post 
const deletePostCtrl = async(req, res,next)=>{
    const id = req.params.id;
    
    try {
        const post = await Posts.findById(id);

        //implemented below logic in the postDetail.ejs 
        if(post.user.toString() !== req.session.userAuth.toString()){
            return res.render("posts/postDetails",{
                error:"you are not authorized to delete this post",
                post:""
            });
        }
        //delete teh post 
       await Posts.findByIdAndDelete(id);
        //redirect to home page
        res.redirect("/");
        } 
        catch (error) {
        return res.render("posts/postDetails",{
            error:error.message,
            post:""
        });
    }
}

module.exports = {
    createPostCtrl,
    getAllPostsCtrl,
    getPostCtrl,
    updatePostCtrl,
    deletePostCtrl
}


