const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path")

const CONFIG = require("./config");
const cvRoutes = require("./routes/cvs");
const userRoutes = require("./routes/users");

const app = express();

mongoose
  .connect(
    "mongodb+srv://" + process.env.DBUSERNAME + ":" + process.env.DBPASSWORD+"@cluster0-5wcch.mongodb.net/test?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected");
  })
  .catch(() => {
    console.log("Connection Failed");
  });

app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "angular")))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/cv", cvRoutes);
app.use("/api/user", userRoutes);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"))
});

module.exports = app;
