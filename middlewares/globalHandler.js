//global error handler takes not 3 but 4 parameters 
const globalErrHandler = (err, req, res, next)=>{
    //error message
    //stack 
    //status 

    const stack = err.stack;
    const message = err.message;
    const status = err.status? err.status:"failed";
    const statusCode = err.statusCode? err.statusCode:500;

    res.status(statusCode).json({ 
        message,
        status,
        stack,
    });
}

module.exports = globalErrHandler;