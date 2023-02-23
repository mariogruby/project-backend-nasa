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

//AQUI LA RUTA NEWS
router.get("/", isLoggedIn, (req, res, next) => {
  nasaService.listNews()
    .then(response => {
      const newsApi = response.data
      /* console.log("DATA: ", response.data) */
      newsApi.forEach(oneNews => {
        const { date } = oneNews
        News.find({ date })
          .then(result => {
            if (result.length == 0) {
              News.create({ date })
            }
          })

      });
      let data = {
        news: response.data,
        user: req.session.currentUser
      }
      res.render("auth/news", data);
    })
    .catch(err => next(err))
});


/////cuando hacemos click a la noticia y se habre en una nueva pagina //////

router.get("/:date", (req, res, next) => {
  let { date } = req.params;
  News.find({ date })
    .populate("comments")
    .then(result => {
      nasaService.getNews(date)
        .then(response => {
          let data = {
            news: response.data,
            Newscomments: { result },
            user: req.session.currentUser
          }
          console.log("COMMMENTS: ", data.Newscomments)
          res.render("auth/newsDetail", data);
        })
    })
})

router.post("/:date", (req, res, next) => {
  let { date } = req.params;
  let author = req.session.currentUser._id;
  let { contenido } = req.body;

  if (contenido) {
    Comment.create({ contenido, author })
      .then(result => {
        let comments = result._id;
        News.findOneAndUpdate({ date }, { $push: { comments } })
          .then(result => {
            res.redirect(`/news/${date}`)
          })
      })
  }
})

module.exports = router
