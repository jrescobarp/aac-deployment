const User = require("../models/user");
const asyncHandler = require("express-async-handler");


exports.get_user_info = asyncHandler(async( req, res, next) => { 
    if(req.user){
        User.findById(req.user._id).populate({path:'recipe_history'}).populate({path:'recipes'}).then((returnUser) => {
            res.status(200).send(returnUser);
        }).catch((err) => {
            res.status(500).json({ error: 'Error fetching user data', details: err });
          });
      } else {
        // If not authenticated, return null or an empty object with status 200
        res.status(200).send(null); // Explicitly send `null` to indicate no user logged in
      }
});

exports.register_user = asyncHandler(async(req, res, next) => {
    const { email, username, password, first_name, last_name } = req.body;
    const user = new User({email,username, first_name, last_name});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err =>{
        if(err) return next(err);
        const response = new User({email,username, first_name, last_name});
        req.flash('success', "Aprendamos a cocinar!");
        res.send(response);
    });
});


exports.login = asyncHandler(async(req, res, next) => {
    User.findById(req.user._id).populate({path:'recipe_history'}).populate({path:'recipes'}).then((returnUser) => {
        res.status(200).send(returnUser);
    });
});


exports.logout = asyncHandler(async (req, res, next) => {
    req.logout(function(err){
        if(err){return next(err)};
    });
    res.send(req.user);
});

exports.update_user = asyncHandler(async (req, res, next) => {
    const updatedUser = await User.findOneAndUpdate({_id: req.body._id}, req.body);
    res.send(updatedUser);
});