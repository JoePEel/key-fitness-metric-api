//Passport
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const {User} = require('../db/models')
const { clientID, clientSecret } = require('../config/config')


passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });
  
passport.deserializeUser(async function(id, cb) {
user = await User.findOne({ where: { id } })
console.log('desirailizing')
cb(null, user);
});

passport.use(new GoogleStrategy({
    clientID,
    clientSecret,
    callbackURL: "/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    let user;
    user = await User.findOne({ where: {googleId: profile.id} })
    if(!user){
      user = await User.create({
        googleId: profile.id,
        name: profile.name.givenName,
        email: profile.emails[0].value
      })
    }
    return cb(null, user)
  }
));

