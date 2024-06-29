const express = require("express");
const {
    createCommentCtrl,
    getCommentCtrl,
    updateCommentCtrl,
    deleteCommentCtrl
} = require("../../controller/comments/commentsController");
const protected = require("../../middlewares/protected");

const commentsRouter = express.Router();


//post /api/v1/comments
commentsRouter.post("/:id", protected , createCommentCtrl);

//get /api/v1/comments/:id
commentsRouter.get("/:id",getCommentCtrl);

//put /api/v1/comments/:id
commentsRouter.put("/:id",protected,updateCommentCtrl);

//delete /api/v1/comments/:id
commentsRouter.delete("/:id",protected,deleteCommentCtrl);

module.exports = commentsRouter