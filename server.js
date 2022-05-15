const express = require('express');
const mongoose = require('mongoose');
const { MongoDB_URI } = require('./config');
const cors = require('cors');
// const session = require('express-session');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
let campaign = require('./routes/campaign');
let user = require('./routes/user');
let claim = require('./routes/claim');
const fileUpload = require('express-fileupload');

let CloudAddress = require('./models/CloudAddress');

const FRONTEND_URL = process.env.FRONTEND_URL;
const SUCCESS_REDIRECT = process.env.SUCCESS_REDIRECT;
const FAILURE_REDIRECT = process.env.FAILURE_REDIRECT;

const PORT = process.env.PORT || 3000;
const app = express();

//database connection
async function connectDatabase() {
  dbConnected = await mongoose.connect(process.env.MongoDB_URI);
  app.use('/api', campaign);
  app.use('/api', user);
  app.use('/api', claim);
  console.log('Connected to mongoose successfully');
}

require('./passport-js/twitter');

connectDatabase();

//middleware
app.use(express.json());

app.use(fileUpload());

app.set('trust proxy', 1);

const additionalProdCookieSettings = {};

if (process.env.NODE_ENV === 'prod') {
  additionalProdCookieSettings.sameSite = 'none';
}

app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'prod',
    ...additionalProdCookieSettings,
  })
);
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: [
      FRONTEND_URL,
      'https://magicmintv2.herokuapp.com',
      'https://api.twitter.com',
      'https://magicmint.xyz',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // allow session cookie from browser to pass through
  })
);

app.get('/getuser', (req, res) => {
  if (req.user) {
    return res.json({
      success: true,
      message: 'user has successfully authenticated',
      user: req.user,
      cookies: req.cookies,
    });
  }
  res.status(401).json({
    authenticated: false,
    message: 'user has not been authenticated',
  });
});

// when login failed, send failed msg
app.get('/auth/login/failed', (req, res) => {
  res.redirect(FAILURE_REDIRECT);
});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: SUCCESS_REDIRECT,
    failureRedirect: '/auth/login/failed',
  })
);

// app.get('/getuser', (req, res) => {
//   console.log('get user', req.user);
//   res.send(req.user);
// });

app.listen(PORT, () => {
  console.log(`listening on : https://localhost:${PORT}`);
});

app.get('/api', (req, res) => {
  res.send('Welcome to the Magic Mint API');
});

app.get('/', (req, res) => {
  res.send('Welcome to the Magic Mint API');
});
