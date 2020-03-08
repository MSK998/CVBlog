const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const CONFIG = require('./config')
const cvRoutes = require('./routes/cvs');

const {db: {host, port, name, username, password}} = CONFIG;

const app = express();

mongoose.connect('mongodb://'+ username + ':' + password +'@localhost:27017/' + name + '?authSource=' + name)
.then(() => {
  console.log('Connected to' + name + 'on port ' + port);
}).catch(() => {
  console.log('Connection Failed');
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
  next();
});

app.use('/api/cv', cvRoutes);

module.exports = app;
