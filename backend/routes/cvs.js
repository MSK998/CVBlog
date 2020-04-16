const express = require("express");
const CV = require("../models/cv");
const checkAuth = require('../middleware/check-auth')


const router = express.Router();

router.get("/:creator", (req, res, next) => {
  console.log(req.params.creator)
  CV.findOne({ creator: req.params.creator }).then(document => {
    console.log("Document: "+document);

    if (!document) {
      return res.status(204).json({
        message: "No CV",
        cv: null
      });
    } else {
      return res.status(200).json({
        message: "CV Fetched",
        cv: document.section
      });
    }
  });
});

router.put("", checkAuth, (req, res, next) => {

  const cv = new CV({
    _id: req.body._id,
    creator: req.userData.username,
    section: req.body.section,
  });

  CV.collection.updateOne({_id: cv._id}, cv,{upsert: true});

  res.status(201).json({
    message: 'CV updated',
    cv: cv
  })
});

module.exports = router;
