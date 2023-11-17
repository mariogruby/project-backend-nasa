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
  
  
  router.get("/delete/:id", (req,res,next) => {
    let id = req.params.id;
    Comment.findByIdAndDelete(id)
    .then(() => {
      res.redirect(`/news`)

    })
    .catch((err) => console.log(err))
  })

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
              console.log(comment);
              if (req.session.currentUser._id == comment.author._id || req.session.currentUser.isAdmin) {
                commentAux.canDelete = true;
                commentAux.canEdit = true;
              }
              
              // Agregar la fecha formateada al comentario
              commentAux.simplifiedDate = new Date(commentAux.date).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric"
              });
  
              comments.push(commentAux); // Agrega el comentario auxiliar a la lista de comentarios
            });
  
            let simplifiedNewsDate = new Date(response.data.date).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric"
            });
  
            let data = {
              news: { ...response.data, date: simplifiedNewsDate }, // Sobrescribe la fecha con la simplificada
              Newscomments: { ...result, comments }, // Sobrescribe los comentarios con las fechas formateadas
              user: req.session.currentUser,
            };
  
            res.render("auth/newsDetail", data);
          })
          .catch(err => {
            console.error(err);
            res.status(500).send("Error interno del servidor");
          });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error interno del servidor");
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