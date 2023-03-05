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
      newsApi.forEach(oneNews => {
        const { date, title } = oneNews
        News.find({ date })
          .then(result => {
            if (result.length == 0) {
              News.create({ date, title })
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
  router.get("/delete/:id", (req,res,next) => {
    let id = req.params.id;
    Comment.findByIdAndDelete(id)
    .then(() => {
      res.redirect(`/news`)

    })
    .catch((err) => console.log(err))
  })

router.get("/:date", isLoggedIn, (req, res, next) => {
  let { date } = req.params;
  News.findOne({ date })
  .populate("comments")
  .populate({
    path: "comments",
    populate: {
      path: "author",
      model: "User"
    }
  })
  .then(result => {
    nasaService.getNews(date)
    .then(response => {
      let comments = [];
      result.comments.forEach(comment => {
        let commentAux = comment
        if (req.session.currentUser.username == comment.author.username || req.session.currentUser.isAdmin === true){
          commentAux.canDelete = true
        }
        comments.push(comment)
          })
          let data = {
            news: response.data,
            Newscomments: result,
            user: req.session.currentUser,
          }
          data.Newscomments.comments = comments
          console.log("DATE: ", data.Newscomments.comments)
          
          /*  console.log("COMMMENTS: ", data.Newscomments.result[0].comments[3].author.username) */
          res.render("auth/newsDetail", data);
        })
    })
})

router.post("/:date", (req, res, next) => {
  let { date } = req.params;
  let author = req.session.currentUser._id;
  let { contenido } = req.body;

  if (contenido) {
    News.findOne({date})
    .then(result => {
      Comment.create({ contenido, author, news: result.id })
      .then(resolve => {
        let comments = resolve._id;
        News.findOneAndUpdate({ date }, { $push: { comments } })
          .then(result => {

            res.redirect(`/news/${date}`)
          })
      })
    })
  }

})


module.exports = router
