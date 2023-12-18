// En tu middleware isLoggedIn.js

module.exports = (req, res, next) => {
  // checks if the user is logged in when trying to access a specific page
  res.locals.currentUser = req.session.currentUser || null; // Pasa currentUser a res.locals
  if (!req.session.currentUser) {
    return res.redirect("/auth/login");
  }
  next();
};
