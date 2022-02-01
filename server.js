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
// app.use(function(req, res, next){
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
//     res.header("Access-Control-Allow-Headers", "Authorization, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use(cors({ origin: "http://localhost:3002", 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
}));


app.use(
    session({
      secret: "secretcode",
      resave: true,
      saveUninitialized: true,
  }));
  

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
    return done(null, user)
})

passport.deserializeUser((user, done) => {
    return done(null, user)
})
const twitterAuth = new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://localhost:3000/auth/twitter/callback",
}, async (req, accessToken, refreshToken, profile, cb) => {

    // User.findOrCreate({ twitterId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    console.log("profile", profile)

    // const user =  await User.findOneAndUpdate(
    //   { twitterId: profile.id }, //query
    //   {}, //update
    //   {},  //options
    //   function(error, result) {  //callback
    //   if (error) return;
    // });

 
    return cb(null, profile)

  })
passport.use(twitterAuth);

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
passport.authenticate('twitter', { successRedirect: 'http://localhost:3002/welcome',failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log(res)
    res.send("Text")
    // res.redirect('/');
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