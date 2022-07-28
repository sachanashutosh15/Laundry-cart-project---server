const { verify } = require('jsonwebtoken');

const isAuth = (req) => {
  const authorization = req.headers['authorization'];
  try {
    if (!authorization) throw new Error('You need to login');
    const token = authorization.split(' ')[1];
    const { userId } = verify(token, process.env.SECRET_KEY);
    return userId;
  } catch (err) {
    return false;
  }
}

module.exports = { isAuth };