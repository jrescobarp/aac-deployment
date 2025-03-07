import express from "express";
const commentRouter = express.Router();
const {isLoggedIn} = require('../middlewares/isLoggedIn');

const commentController = require('../controllers/commentsController');

commentRouter.get("/:id",commentController.get_comments);
commentRouter.post("/",commentController.create_comment);
commentRouter.put("/:id",commentController.edit_comment);

module.exports = commentRouter;
