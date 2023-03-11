const express = require("express");
const router = express.Router();
const transporter = require("../config/transporter.config");
const templates = require("../templates/template");
// ℹ️ Handles password encryption
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// GET /auth/signup
router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

// POST /auth/signup
router.post("/signup", isLoggedOut, (req, res, next) => {
  const { username, email, password } = req.body;


  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });

    return;
  }

  if (password.length < 6) {
    res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });

    return;
  }

  //   ! This regular expression checks password for special characters and minimum length
  /*
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(400)
      .render("auth/signup", {
        errorMessage: "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter."
    });
    return;
  }
  */

  // Create a new user - start by hashing the password
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      // Create a user and save it in the database
      return User.create({ username, email, password: hashedPassword });
    })
    .then((user) => {
      //nodemailer aquí
      transporter.sendMail({
        from: `"NASA" <${process.env.EMAIL_ADDRESS}>`,
        to: email,
        subject: "HOLA, bienvenido a la nasa, te haz registrado con exito",
        text: "message",
        // html: templates.templateExample("hola mundo")
      })
        .then((info) => res.render("message", { email, subject, message, info }))
        .catch((error) => console.log(error));
      ///////////////////////////////
      res.redirect("/auth/login");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username and email need to be unique. Provide a valid username or email.",
        });
      } else {
        next(error);
      }
    });
});

// GET /auth/login
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

// POST /auth/login
router.post("/login", isLoggedOut, (req, res, next) => {
  const { email, password } = req.body;

  // Check that username, email, and password are provided
  if (email === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage:
        "All fields are mandatory. Please provide username, email and password.",
    });

    return;
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 6) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
  }

  // Search the database for a user with the email submitted in the form
  User.findOne({ email })
    .then((user) => {
      // If the user isn't found, send an error message that user provided wrong credentials
      if (!user) {
        res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
        return;
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            res
              .status(400)
              .render("auth/login", { errorMessage: "Wrong credentials." });
            return;
          }

          // Add the user object to the session object
          req.session.currentUser = user;
          // Remove the password field
          delete req.session.currentUser.password;

          res.redirect("/news");
        })
        .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
    })
    .catch((err) => next(err));
});

// GET /auth/logout
router.get("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("auth/logout", { errorMessage: err.message });
      return;
    }

    res.redirect("/auth/login");
  });
});
//Perfil

// GET /auth/profile
router.get("/profile", isLoggedIn, (req,res,next) => {
  res.redirect(`/auth/profile/${req.session.currentUser._id}`)
})

router.get("/profile/:id", isLoggedIn, (req,res,next) => {
  /* let id = req.session.currentUser._id */
  const userId = req.params.id;
  /* const user = req.session.currentUser; */
  User.findById(userId)
  .then((user) => {
    Comment.find({author: userId})
    .populate("news")
    .then(comments => {
      res.render("auth/profile", { user, comments });
    })
    
  })
  .catch(err => { console.log(err)})
});

router.get("/profile/:id/edit",isLoggedIn, (req,res,next) => {
  const {id} = req.params;
  if (req.session.currentUser._id == id){
    res.render("auth/profileEdit", {user: req.session.currentUser})
  }
  else res.redirect(`/auth/profile/${id}`)
  
});

router.post("/profile/:id/edit",isLoggedIn, (req,res,next) => {
    const userId = req.params.id;
    console.log(userId)
    const { username, email, password } = req.body;

    User.findById(userId)
      .then(user => {
        const updateData = {};
        if (req.body.username && req.body.username.length > 0) {
          updateData.username = req.body.username;
        } else {
          updateData.username = user.username;
        }
        if (req.body.email && req.body.email.length > 0) {
          updateData.email = req.body.email;
        } else {
          updateData.email = user.email;
        }
        if (req.body.password && req.body.password.length > 6) {
          bcrypt.genSalt(saltRounds)
            .then(salt => bcrypt.hash(password, salt))
            .then(hashedPassword => {
              updateData.password = hashedPassword;
              User.findByIdAndUpdate(userId, { $set: updateData }, { new: true })
                .then(updatedUser => {
                  req.session.currentUser = updatedUser;
                  res.redirect(`/auth/profile/${userId}`);
                })
  
            })  
  
        } else {
          User.findByIdAndUpdate(userId, { $set: updateData }, { new: true })
            .then(updatedUser => {
              req.session.currentUser = updatedUser;
              res.redirect(`/auth/profile/${userId}`);
            })
            .catch((error) => {
                  if (error instanceof mongoose.Error.ValidationError) {
                    res.status(500).render("auth/profileEdit", { errorMessage: error.message });
                  } else if (error.code === 11000) {
                    res.status(500).render("auth/profileEdit", {
                      errorMessage:
                        "Username and email need to be unique. Provide a valid username or email.",
                    });
                  } else {
                    next(error);
                  }
            });
          }
        })
      })

router.get("/profile/:id/edit/comment",isLoggedIn, (req,res,next) => {
  const {id} = req.params;
  User.findById(id)
  .then(elem => {
    Comment.find({author:id})
    .populate("author news")
    .then(result => {
      if (req.session.currentUser._id == id){
        res.render("auth/commentsProfileEdit", {result})
      }
      else res.redirect(`/auth/profile/${id}`)

    })
  })
  
});


router.post("/profile/:id/edit/comment", isLoggedIn, (req,res,next) => {
  const {id} = req.params;
  const {commentMod} = req.body;
  if(commentMod && commentMod.length > 0){
    Comment.findByIdAndUpdate(id, {contenido:commentMod},{new:true})
    .then(result => {
      console.log(result)
      req.session.currentUser.comments.push(result)
      res.redirect(`/auth/profile/${req.session.currentUser._id}`)
    })
  }
  /* User.findById(id)
  .then(result => {
    let updateComments = [];
    if(commentss && commentss.length > 0) updateComments.push(commentss)
    Comment.findByIdAndUpdate(id, { $set: updateComments[0] }, { new: true })
    .then(updatedUser => {
      
      req.session.currentUser.comments = updateComments;
      
      res.redirect(`/auth/profile/${id}`)
    })
  }) */
  
});


module.exports = router;
