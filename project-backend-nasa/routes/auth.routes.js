const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

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
router.get("/logout", isLoggedIn, (req, res,next) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("auth/logout", { errorMessage: err.message });
      return;
    }

    res.redirect("/auth/login");
  });
});

// GET /auth/profile

router.get("/profile", (req,res,next) => {
  let id = req.session.currentUser._id
  User.findById(id)
  .populate("news comments likes")
  .populate({
    path: "likes",
    populate: {
      path: "comments",
      model: "Comment",
      populate:{
        path: "news",
        model: "News"
      }
    }
  })
  .then(result => {
    console.log(result);
    let data = {
      profile: result,
      user: req.session.currentUser
    }
    res.render("auth/profile", data)
  })
  .catch(err => { console.log(err)})
  
});

router.get("/profile/:id/edit", (req,res,next) => {
  /* const {id} = req.params; */
 /*  console.log(req.session.currentUser) */
  /* console.log(req.params) */
  res.render("auth/profileEdit", {user: req.session.currentUser})
});

router.post("/profile/:id/edit", (req,res,next) => {
  const {userId} = req.params.id
  const {username, email, password} = req.body;
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
        bcrypt
        .genSalt(saltRounds)
        .then((salt) => bcrypt.hash(password, salt))
        .then(hashedPassword => {
            // Update a user and save it in the database
          User.findByIdAndUpdate(req.session.currentUser._id,{username, email, password:hashedPassword}, {new:true})
          .then((result) => {
            console.log(result)
            req.session.currentUser = result
            console.log( "Esto es current desp. de update",req.session.currentUser)
        
            res.redirect("/auth/profile");
          })
        })
      }
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
});

/* router.get("/pepe", (req, res, next) => {
  let {id} = req.params;
  User.findById({id})
  .populate("news comments likes")
  .populate({
    path: "likes",
    populate: {
      path: "comments",
      model: "Comment",
      populate:{
        path: "news",
        model: "News"
      }
    }
  })
  .then(result => {
    console.log(result)
    res.render("auth/profile", result)
  })
  .catch(err => { console.log(err)})
}); */

/* 
router.post("/profile", (req, res, next) => {
  const {id} = req.params;
  res.redirect("/auth/profile")
}); */

/* router.get("/profile/:id", (req, res, next) => {

  console.log(req.session.currentUser + "AQUIIIIIIII")
  console.log("AQUIIIIIIII")

  const userId = req.params.id;
  const user = req.session.currentUser;;
  User.findById(userId)

    .then((user) => {
      res.render("auth/profile", { user });
    })
    .catch((err) => console.log(err));
}); */

// router.post("/edit/:id", (req, res, next) => {
//     let { Name, email } = req.body;
//     let id = req.curranteUser.id
//     let editedProfile = { name, email, }
//     User.findOneAndUpdate({ _id: id }, editedProfile, { new: true })
//         .then((data) => {
//             res.redirect("/profile/:id")
//         })
//         .catch((err) => {
//             console.log(err)
//         })
// })



module.exports = router;
