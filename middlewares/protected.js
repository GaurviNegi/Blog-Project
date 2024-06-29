const appErr = require("../utils/appError");

const protected = (req, res ,next)=>{
   if(req.session.userAuth){
    next();
   }
   else{
    return res.render("users/notAuthorize");
   }
}
module.exports = protected;