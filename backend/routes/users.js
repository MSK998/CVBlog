const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const CONFIG = require("../config");

const {
  jwt: { secret }
} = CONFIG;

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      username: req.body.username,
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;

  User.findOne({ username: req.body.username })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication Failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Authentication Failed"
        });
      }
      //do something if the result = true
      const token = jwt.sign(
        { username: fetchedUser.username, userId: fetchedUser._id },
        secret,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        token: token,
        userId: fetchedUser._id,
        expiresIn: 3600
      });
    })
    .catch(err => {
      return res.status(500).json({
        message: "Auth Failed",
        error: err
      });
    });
});

module.exports = router;
