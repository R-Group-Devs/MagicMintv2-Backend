const express  = require('express');
const mongoose = require('mongoose');
const { MongoDB_URI } = require('./config')
const cookieParser = require('cookie-parser');
const serverless = require('serverless-http');
const cors = require('cors');
const session = require('express-session')
const passport = require('passport')
const TwitterStrategy = require('passport-twitter').Strategy;
let campaign = require('./routes/campaign') 
let user = require('./routes/user') 
let oauth = require('./routes/oauth'); 
let User = require('./models/User')


const TWITTER_CONSUMER_KEY = process.env.CONSUMER_KEY;
const TWITTER_CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;
const CALLBACK_URL = process.env.CALLBACK_URL;
const SUCCESS_REDIRECT = process.env.SUCCESS_REDIRECT;
const FAILURE_REDIRECT = process.env.FAILURE_REDIRECT;


const PORT = process.env.PORT || 3000;
const app = express();

//database connection
async function connectDatabase() {
    dbConnected = await mongoose.connect(process.env.MongoDB_URI);
    app.use('/api', oauth);
    app.use('/api', campaign);
    app.use('/api', user);
    console.log("Connected to mongoose successfully");
}
connectDatabase()

//middleware
app.use(express.json());
app.use(cors({ origin: FRONTEND_URL, 
    credentials: true // allow session cookie from browser to pass through
}));

app.set("trust proxy", 1)

app.use(
    session({
      secret: "secretcode",
      resave: true,
      key: 'sid',
      cookie: { 
        sameSite: 'none',
        secure: false,
        maxAge: 1000 * 60 * 60 * 60
      },
      saveUninitialized: true,
  }));

app.use(cookieParser('secretcode'))
  

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  console.log('serializeUser: ', user)

    return done(null, user)
})

passport.deserializeUser((user, done) => {
    return done(null, user)
})
const twitterAuth = new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: CALLBACK_URL,
}, async (req, accessToken, refreshToken, profile, cb) => {

     user =  await User.findOne({ twitterId: profile.id });

    if(!user){
      newUser = new User({
        username: profile.username,
        twitterId: profile.id,
        profileCreated: new Date()
      })  
      const saved = await newUser.save()
      console.log("saved",saved)
    }
 

 
    return cb(null, profile)

  })
passport.use(twitterAuth);

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
passport.authenticate('twitter', { successRedirect: SUCCESS_REDIRECT,failureRedirect: FAILURE_REDIRECT }),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log(res)
    res.send("Text")
    res.redirect('/');
  });

  app.get("/getuser", (req, res) => {
    res.send(req.user);
  })



app.listen(PORT, () => {
    console.log(`listening on : http://localhost:${PORT}`);
});

app.get('/api', (req, res) => {

    res.send("Welcome to the Magic Mint API");

});

app.get('/', (req, res) => {

    res.send("Welcome to the Magic Mint API");

});