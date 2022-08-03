const jwt = require('jsonwebtoken');

function createAccessToken(userId) {
  return jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: '1h',
  })
}

function sendAccessToken(res, req, accessToken) {
  res.send({
    result: "Logged in Successfully",
    accessToken,
    email: req.body.email,
  })
}

module.exports = { 
  createAccessToken,
  sendAccessToken
};