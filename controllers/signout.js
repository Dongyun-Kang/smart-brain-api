const redisClient = require('./signin').redisClient;

const handleSignout = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json('Need token to signout');
  } 
  return redisClient.del(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json('Unauthorized');
    }
    return res.json(reply);
  })
}

module.exports = {
  handleSignout: handleSignout,
}