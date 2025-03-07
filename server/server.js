"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
// import cors from "cors";
const express_1 = __importDefault(require("express"));
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require("connect-mongo");
var recipeRouter = require("./src/routes/recipe.routes");
var userRouter = require('./src/routes/user.routes');
var commentRouter = require('./src/routes/comment.routes');
var imageRouter = require('./src/routes/image.routes');
var User = require('./src/models/user');
const serverlessExpress = require('aws-serverless-express');
const cors = require('cors');
// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();
const { ATLAS_URI } = process.env;
if (!ATLAS_URI) {
    console.error("No ATLAS_URI environment variable has been defined in config.env");
    process.exit(1);
}
mongoose.connect(ATLAS_URI);
const app = (0, express_1.default)();
app.use(cors());
const sessionConfig = {
    store: MongoStore.create({ mongoUrl: ATLAS_URI }),
    name: 'aacSession',
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 5,
        maxAge: 1000 * 60 * 60 * 24 * 5
    }
};
//body-parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
//passport initialization
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
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
// app.listen(5200, () => {
//     console.log(`Server running at http://localhost:5200...`);
// });
const server = serverlessExpress.createServer(app);
exports.handler = (event, context) => {
    serverlessExpress.proxy(server, event, context);
};
//# sourceMappingURL=server.js.map