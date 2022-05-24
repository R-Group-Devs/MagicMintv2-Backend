const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/User');

passport.serializeUser(function (user, done) {
  done(null, user.TwitterId);
});
passport.deserializeUser((twitterId, done) => {
  User.findOne({ TwitterId: twitterId })
    .then((user) => {
      done(null, user);
    })
    .catch((e) => {
      done(new Error('Failed to deserialize an user'), null);
    });
});

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.CONSUMER_KEY,
      consumerSecret: process.env.CONSUMER_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (token, refreshToken, profile, done) => {
      const user = await User.findOne({ TwitterId: profile.id });
      if (!user) {
        const newUser = new User({
          username: profile.username,
          TwitterId: profile.id,
          twitterPhoto: profile.photos[0].value ?? null,
          profileCreated: new Date(), // this shouldn't be set here, set it in the model
        });
        await newUser.save();
        return done(null, newUser);
      }
      if (!user.twitterPhoto) {
        // just for now - this check and its body will be deleted after db reset
        user.twitterPhoto = profile.photos[0].value ?? null;
        await user.save();
      }
      return done(null, user);
    }
  )
);
