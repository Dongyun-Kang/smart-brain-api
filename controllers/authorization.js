const redisClient = require('./signin').redisClient;

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    console.log('You should pass1');
    return res.status(401).json('Unauthorized');
  }
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      console.log('You should pass2');
      return res.status(401).json('Unauthorized');
    }
    console.log('Middleware pass');
    return next();
  })
}

module.exports = {
  requireAuth: requireAuth,
}