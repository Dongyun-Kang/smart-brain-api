const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const signout = require('./controllers/signout')
const profile = require('./controllers/profile')
const image = require('./controllers/image')
const auth = require('./controllers/authorization')

const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL
  // connection: {
  //   connectionString: process.env.DATABASE_URL,
  //   ssl: true
  // }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

app.get('/', (req, res) => { res.send('It is working!'); });

app.post('/signin', signin.signinAuthentication(db, bcrypt)); // high order function

app.post('/signout', (req, res) => { signout.handleSignout(req, res) }); // high order function

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db) });

app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db) });

app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db) });

app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res) });

app.listen(process.env.PORT || 3000, process.env.IP, function () {
  console.log(`The SmartBrain Server Has Started on port ${process.env.PORT || 3000}`);
});
