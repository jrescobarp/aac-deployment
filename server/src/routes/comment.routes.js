"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentRouter = express_1.default.Router();
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const commentController = require('../controllers/commentsController');
commentRouter.get("/:id", commentController.get_comments);
commentRouter.post("/", commentController.create_comment);
commentRouter.put("/:id", commentController.edit_comment);
module.exports = commentRouter;
//# sourceMappingURL=comment.routes.js.map