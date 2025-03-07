import express from "express";
const userRouter = express.Router();
const passport = require('passport');
const {isLoggedIn} = require('../middlewares/isLoggedIn');

const userController = require('../controllers/usersController');

userRouter.get("/", userController.get_user_info);
userRouter.post("/register",userController.register_user);
userRouter.post("/login", passport.authenticate('local', {failureFlash:true}), userController.login);
userRouter.get("/logout", userController.logout);
userRouter.put("/:id", userController.update_user);
// userRouter.get("/userDisplay", isLoggedIn, userController.userDisplay);
 
module.exports = userRouter;
