const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const isLoggedOut = require('../middleware/isLoggedOut');
const isAdmin = require('../middleware/isAdmin');
const User = require("../models/User.model");
const New = require("../models/News.model");
const Comment = require("../models/Comment.model")



router.get("/profile/:id", (req, res, next) => {
    const userId = req.currentUser.id;
    User.findById(userId, (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }
        res.render('profile', { user });
    });


});

router.post("/profile/edit/:id", (req, res, next) => {
    let { Name, email } = req.body;
    let id = req.curranteUser.id
    let editedProfile = { Name, email, }
    User.findOneAndUpdate({ _id: id }, editedProfile, { new: true })
        .then((data) => {
            res.redirect("/profile/:id")
        })
        .catch((err) => {
            console.log(err)
        })
})


module.exports = router;
