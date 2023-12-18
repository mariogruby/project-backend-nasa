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
const { populate } = require('../models/User.model');

//AQUI LA RUTA NEWS
router.get("/", isLoggedIn, (req, res, next) => {
  nasaService.listNews()
    .then(response => {
      const newsApi = response.data.reverse()
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
  
  
  /////cuando hacemos click a eliminar el comentario //////
  router.get("/delete/:id", (req,res,next) => {
    let id = req.params.id;
    Comment.findByIdAndDelete(id)
    .then(() => {
      res.redirect(`/news`)

    })
    .catch((err) => console.log(err))
  })
///aqui para editar el comentario
  router.post("/edit/:id", (req,res,next) => {
    let _id = req.params.id;
    let { contenido } = req.body;
    console.log(contenido)
    Comment.findOneAndUpdate({_id}, {contenido})
    .populate("news")
    .then(result => {
      res.redirect(`/news/${result.news.date}`)
    })
    .catch((err) => console.log(err))
  })

// Función para formatear la fecha en un formato deseado (ejemplo: DD/MM/YYYY)
function formatDate(date) {
  const commentDate = new Date(date);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return commentDate.toLocaleDateString('en-US', options);
}

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
            let commentAux = comment;
            commentAux.formattedDate = formatDate(comment.date); // Formatear la fecha del comentario

            if (req.session.currentUser._id == comment.author._id || req.session.currentUser.isAdmin) {
              commentAux.canDelete = true;
              commentAux.canEdit = true;
            }
            comments.push(comment);
          });

          let data = {
            news: response.data,
            Newscomments: result,
            user: req.session.currentUser,
          };
          data.Newscomments.comments = comments;

          res.render("auth/newsDetail", data);
        })
        .catch(err => {
          console.log(err);
          next(err);
        });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});


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

