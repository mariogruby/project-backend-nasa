const express = require('express');
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();

const mongoose = require("mongoose");

//Nasa API
const nasaService = require("../services/nasa.service");

//modelos
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");
const News = require("../models/News.model");

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
/* router.post("/", (req, res, next) => {

}); */
  
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
  
  /*console.log("EMAIL: ", user._id)
  res.send( user._id) */
  
  router.get("/:date", (req, res, next) => {
    let {date} = req.params;
    News.find({date})
    .populate("comments")
      .then(result => {
        nasaService.getNews(date)
          .then(response => {
            let data = {
              news: response.data,
              Newscomments: {result}
            }
            res.render("auth/newsDetail", data);
          })
    })
  })
  
  router.post("/:date", (req, res, next)=> {
    let {date} = req.params;
    let author = req.session.currentUser._id;
    let {contenido} = req.body;
    
    Comment.create({contenido, author})
    .then(result => {
      let comments = result._id;
      News.create({date, comments})
      .then(result => {
      })
      res.redirect(`/news/${date}`)
    })
})

  module.exports = router