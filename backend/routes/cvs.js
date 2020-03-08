const express = require("express");
const CV = require("../models/cv");

const router = express.Router();

router.get("/:id", (req, res, next) => {
  console.log(req.params.id);

  CV.findOne({ _id: req.params.id }).then(document => {
    console.log(document);

    if (document === null) {
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

router.put("", (req, res, next) => {

  const cv = new CV({
    _id: req.body._id,
    section: req.body.section
  });

  console.log(cv)

  CV.collection.updateOne({_id: cv._id}, cv, {upsert: true});

  console.log('CV saved');

  res.status(201).json({
    message: 'CV updated',
    cv: cv
  })
});

module.exports = router;
