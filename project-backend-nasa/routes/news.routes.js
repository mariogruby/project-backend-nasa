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


  
  /////cuando hacemos click a la noticia y se habre en una nueva pagina

  /* router.get("/get/:date", (req, res, next)=> {
    nasaService.getNews(req.params.date)
    .then(response => {
      let prueba = response.json()
      console.log(prueba)
      //console.log("FECHA ", req.params.date)
      let data = {
        news: response.data
      }
      //console.log(data)
      res.render("/")
      //res.render("", data)
    })
  }) */

module.exports = router