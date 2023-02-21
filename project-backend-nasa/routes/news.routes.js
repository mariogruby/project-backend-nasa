const express = require('express');
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();

const mongoose = require("mongoose");

//Nasa API
const nasaService = require("../services/nasa.service");

//AQUI LAS RUTAS NEWS
router.get ("/", isLoggedIn, (req,res,next) => {
    nasaService.listNews()
    .then(response => {
        let data = {
            news: response.data
        }
        res.render("auth/news", data);
    })  
    .catch(err => next(err))
});
router.post("/", (req, res, next) => {
  
});
module.exports = router