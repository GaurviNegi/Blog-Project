//using common js module 
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const usersRouter = require("./routes/users/usersRoute");
const postsRouter = require("./routes/posts/postsRoute");
const Posts = require("./model/posts/posts");
const commentsRouter = require("./routes/comments/commentsRoute");
const globalErrHandler = require("./middlewares/globalHandler");
const truncatePost = require("./utils/truncater");
require("./config/dbConnect");
const app = express();



//middlewares
//ejs config
app.set("view engine","ejs");
//serving static file 
app.use(express.static(__dirname+"/public"))

//to parse coming json
app.use(express.json());
//to parse incoming data from web pages
app.use(express.urlencoded({extended:true}))
//session config
app.use(session({
    secret:process.env.SECRET_KEY,
    resave:false,
    saveUninitialized:true,
    store: MongoStore.create({
        mongoUrl:process.env.MONGO_URL,
        ttl: 24 * 60 * 60 // = 1days
      })
}))

//save the login user into the locals 
app.use((req, res, next)=>{
    if(req.session.userAuth){
       res.locals.userAuth = req.session.userAuth;
    }else{
       res.locals.userAuth = null;
    }
    next();
});

//middleware for method-override
app.use(methodOverride("_method"));

//setting locals for truncate
app.locals.truncatePost = truncatePost;



//home page 
app.get("/",async(req, res)=>{
  try {
    let posts =await Posts.find({}).populate("user");
    //length of posts available
    const pages=posts.length%6===0?Math.floor(posts.length/6):Math.floor(posts.length/6)+1;
    
   const i = req.query.page? req.query.page: 1;
   posts = posts.splice((i-1)*6,6);

    res.render("index",{posts,pages});
  } catch (error) {
    res.render("index",{error:error.message});
  }
});

//*user route
app.use("/api/v1/users",usersRouter)
//*posts route
app.use("/api/v1/posts",postsRouter);
//*comments route
app.use("/api/v1/comments",commentsRouter);




//error handler
app.use(globalErrHandler);
//listen server 
const PORT = process.env.PORT || 9000;
app.listen(PORT,console.log(`the server is running at port number ${PORT}`));
