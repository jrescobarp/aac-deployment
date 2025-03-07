"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter = express_1.default.Router();
const passport = require('passport');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const userController = require('../controllers/usersController');
userRouter.get("/", userController.get_user_info);
userRouter.post("/register", userController.register_user);
userRouter.post("/login", passport.authenticate('local', { failureFlash: true }), userController.login);
userRouter.get("/logout", userController.logout);
userRouter.put("/:id", userController.update_user);
// userRouter.get("/userDisplay", isLoggedIn, userController.userDisplay);
module.exports = userRouter;
//# sourceMappingURL=user.routes.js.map