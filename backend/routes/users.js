const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const CV = require('../models/cv')

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      username: req.body.username,
      password: hash,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created",
          result: result,
        });

        const cv = new CV({
          _id: result._id,
          creator: result.username,
          section: []
        })
        cv.save().then((cvResult) => {
          console.log(cvResult)
        })
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  console.log(process.env.SECRET)

  let fetchedUser;

  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user === null) {
        return
      } else {
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
      }
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Authentication Failed",
        });
      } else {
        const token = jwt.sign(
          { username: fetchedUser.username, userId: fetchedUser._id },
          process.env.SECRET,
          { expiresIn: "1h" }
        );

        return res.status(200).json({
          token: token,
          userId: fetchedUser._id,
          username: fetchedUser.username,
          expiresIn: 3600,
        });
      }
      //do something if the result = true
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message: "Auth Failed",
        error: err,
      });
    });
});

module.exports = router;
