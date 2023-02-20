const express = require('express');
const router = express.Router();


//AQUI LAS RUTAS NEWS
router.get ("/", (req,res,next) => {
    res.render("auth/news")
});
router.post("/", (req, res, next) => {
    
});

module.exports = router