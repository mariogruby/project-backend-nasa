module.exports = (req, res, next) => {
    if(req.session.currentUser && req.session.currentUser.role == "Admin") next();
    else res.redirect("/user/login");
}