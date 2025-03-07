import * as dotenv from "dotenv";
// import cors from "cors";
import express from "express";
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require("connect-mongo");
var recipeRouter = require("./routes/recipe.routes");
var userRouter = require('./routes/user.routes');
var commentRouter = require('./routes/comment.routes');
var imageRouter = require('./routes/image.routes');
var User = require('./models/user');

 
// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();
 
const { ATLAS_URI } = process.env;
 
if (!ATLAS_URI) {
   console.error("No ATLAS_URI environment variable has been defined in config.env");
   process.exit(1);
}


mongoose.connect(ATLAS_URI);
const app = express();
// app.use(cors());

const sessionConfig = {
    store: MongoStore.create({ mongoUrl: ATLAS_URI }),
    name:'aacSession',
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 5,
        maxAge: 1000 * 60 * 60 * 24 * 5
    }
}

//body-parser
app.use(express.json());       
app.use(express.urlencoded()); 

//passport initialization
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req:any, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//initialize routes
app.use("/recipes", recipeRouter);
app.use("/user", userRouter);
app.use("/comments", commentRouter);
app.use("/image", imageRouter);

// start the Express server
app.listen(5200, () => {
    console.log(`Server running at http://localhost:5200...`);
});