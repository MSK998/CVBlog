const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const cvRoutes = require('./routes/cvs');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
  next();
});

app.use('/api/cv', cvRoutes);

module.exports = app;
