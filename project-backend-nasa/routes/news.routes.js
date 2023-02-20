const express = require('express');
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();


//AQUI LAS RUTAS NEWS
router.get ("/", isLoggedIn, (req,res,next) => {
    res.render("auth/news")
});
router.post("/", (req, res, next) => {

});

module.exports = router