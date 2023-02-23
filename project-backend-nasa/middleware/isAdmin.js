module.exports = (req, res, next) => {
    if (req.session.currentUser && req.session.currentUser.isAdmin) next();
    else res.redirect("/user/login");
};