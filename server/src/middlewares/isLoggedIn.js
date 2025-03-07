module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        console.log("USER IS NOT SIGNED IN");
        return req.flash('error', 'You must be signed in first!');
    }
    next();
}