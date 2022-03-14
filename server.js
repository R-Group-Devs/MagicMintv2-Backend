
const express  = require('express');
const mongoose = require('mongoose');
const { MongoDB_URI } = require('./config')
const cors = require('cors');
const session = require('express-session')
const passport = require('passport')
const TwitterStrategy = require('passport-twitter').Strategy;
let campaign = require('./routes/campaign') 
let user = require('./routes/user') 
let claim = require('./routes/claim')
let oauth = require('./routes/oauth'); 
const fileUpload = require('express-fileupload');

let User = require('./models/User');


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
    app.use('/api', claim);
    console.log("Connected to mongoose successfully");
}
connectDatabase()

//middleware
app.use(express.json());
app.use(cors({ origin: FRONTEND_URL, 
    credentials: true // allow session cookie from browser to pass through
}));
app.use(fileUpload());



app.set('trust proxy', 1)

app.use(
    session({
      secret: "secretcode",
      resave: true,
      proxy: true,
      saveUninitialized: true,
      // cookie: {sameSite: 'none', secure: true, proxy: true, maxAge: 1000 * 60 * 60 * 24 * 7 },

  }));
  

app.use(passport.initialize())
app.use(passport.session())


passport.serializeUser((user, done) => {
    console.log("serialize")
    return done(null, user)
})

passport.deserializeUser((user, done) => {
  console.log("deserialize")
    return done(null, user)
})
const twitterAuth = new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: CALLBACK_URL,
}, async (req, accessToken, refreshToken, profile, cb) => {

    user =  await User.findOne({ username: profile.username });
    // it is not refreshing as it should, frontend problem!

    if(user == undefined){
      newUser = new User({
        username: profile.username,
        twitterId: profile.id,
        profileCreated: new Date()
      })  
      const saved = await newUser.save()
    }
    return cb(null, profile)
  })

passport.use(twitterAuth);

app.get('/auth/twitter', passport.authenticate('twitter'),function(req, res){
  
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader("Access-Control-Allow-Origin" , FRONTEND_URL)
  req.setHeader('Content-Type', 'application/json')
  req.setHeader('Access-Control-Allow-Credentials', 'true')
  req.setHeader("Access-Control-Allow-Origin" , FRONTEND_URL)
  console.log("req headers in first call",req.headers)
  console.log("response headers in first call",res.headers)
});

// axios.get('/auth/twitter', {withCredentials: true }, passport.authenticate('twitter'))

app.use('/auth/twitter/callback', 
passport.authenticate('twitter', {  failureRedirect: FAILURE_REDIRECT }),  function (req, res) {
  // Successful authentication, redirect home.
  console.log("callback")
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader("Access-Control-Allow-Origin" , FRONTEND_URL)
  res.setHeader("cookie", req.headers.cookie)
  res.cookie('cookie', req.headers.cookie)
  // req.setHeader('Content-Type', 'application/json')
  // req.setHeader('Access-Control-Allow-Credentials', 'true')
  // req.setHeader("Access-Control-Allow-Origin" , FRONTEND_URL)
  console.log("req headers in callback",req.headers)
  console.log("response headers in callback",res)

  res.redirect(SUCCESS_REDIRECT)
  

})

  app.get("/getuser", (req, res) => {
    console.log("get user")
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