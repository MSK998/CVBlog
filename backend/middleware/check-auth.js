const jwt = require('jsonwebtoken');

const CONFIG = require('../config')

const {
  jwt: { secret }
} = CONFIG

module.exports = (req, res, next) => {

  try {

    const token = req.headers.authorization.split(' ')[1];

    const decodedToken = jwt.verify(token, secret);
    req.userData = {username: decodedToken.username, userId: decodedToken.userId}
    next();

  } catch (error) {

    res.status(401).json({
      message: 'Auth failed - No Token'
    });

  }

}