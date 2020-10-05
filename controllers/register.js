const jwt = require('jsonwebtoken');
const redisClient = require('./signin').redisClient;

const transactionAndGetToken = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return Promise.reject('incorrect register form')
  }
  const hash = bcrypt.hashSync(password)
  return db.transaction(trx => {
    return trx.insert({
      hash: hash,
      email: email,
    })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then(user => {
            return user[0];
            // res.json(user[0]);
          })
          .catch(err => Promise.reject('unable to insert user in register'))
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .catch(err => Promise.reject('Unable to register'))
}

const createSessions = (user) => {
  // JWT token and return user data
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: 'true', userId: id, token }
    })
    .catch(err => Promise.reject('Unable to create sessions'))
}

const signToken = (email) => {
  const jwtPayLoad = { email };
  return jwt.sign(jwtPayLoad, 'JWT_SECRET', { 
    expiresIn: '300' 
    // expiresIn: '2 days' 
  }); //process.env.JWT_SECRET
}

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value));
}

const handleRegister = (req, res, db, bcrypt) => {
  return transactionAndGetToken(req, res, db, bcrypt)
      .then(data => {
        return data.id && data.email ? createSessions(data) : Promise.reject(data) // reject with data for debug
      })
      .then(session => res.json(session))
      .catch(err => res.status(400).json(err));
}

module.exports = {
  handleRegister: handleRegister
}