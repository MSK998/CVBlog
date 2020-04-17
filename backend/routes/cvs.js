const express = require("express");
const CV = require("../models/cv");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/:creator", (req, res, next) => {
  CV.findOne({ creator: req.params.creator }).then((document) => {
    console.log("Document: " + document);

    if (!document) {
      return res.status(204).json({
        message: "No CV",
        cv: null,
      });
    } else {
      return res.status(200).json({
        message: "CV Fetched",
        creator: document.creator,
        cv: document.section,
      });
    }
  });
});

router.put("", checkAuth, (req, res, next) => {
  const cv = new CV({
    _id: req.userData.userId,
    creator: req.body.creator,
    section: req.body.section,
  });

  console.log("__________________");
  console.log(cv);
  console.log("__________________");

  CV.collection.updateOne({ _id: cv._id, creator: cv.creator }, cv)
    .then((result) => {
      console.log(result)
      if (result.result.nModified > 0) {

        console.log("Approved")
        res.status(201).json({
          message: "CV updated",
          cv: cv,
        });
      } else {
        console.log("Not Approved")
        res.status(401).json({
          message: "Not Authorized from API",
          cv: cv,
        });
      }
    });
});

module.exports = router;
