const { isAuth } = require('./authorization');

const authorize = (req, res, next) => {
  try {
    const userId = isAuth(req);
    if (!userId) throw new Error('Please log in');
    next();
  } catch (err) {
    res.send({
      error: `${err.message}`,
    })
  }
}

module.exports = { authorize };