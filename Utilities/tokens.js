const jwt = require('jsonwebtoken');

function createAccessToken(userId) {
  return jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: '1h',
  })
}

module.exports = { createAccessToken };