const jwt = require('jsonwebtoken');

function createAccessToken(userId) {
  return jwt.sign({ userId }, process.env.SECRET_KEY, {
  })
}

module.exports = { createAccessToken };