var FacebookStrategy  = require('passport-facebook').Strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('../config/config.js');
module.exports = function(passport,mysqlconnection) {
  passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret:config.facebook.clientSecret ,
    callbackURL: config.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Checking whether user exists or not using profile.id
      mysqlconnection.query("SELECT * from facebookuser where userid="+profile.id,function(err,rows,fields){
        if(err) throw err;
        if(rows.length===0)
          {
            mysqlconnection.query("INSERT into facebookuser(userid,username) VALUES('"+profile.id+"','"+profile.displayName+"')");
          }
          else
            {
              console.log("User already exists in database");
            }
          });
      return done(null, profile);
    });
  }
));
passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret:config.google.clientSecret ,
    callbackURL: config.google.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Checking for user exists or not using profile.id
      mysqlconnection.query("SELECT * from googleuser where userid="+profile.id,function(err,rows,fields){
        if(err) throw err;
        if(rows.length===0)
          {
            mysqlconnection.query("INSERT into googleuser(userid,username,email) VALUES('"+profile.id+"','"+profile.displayName+"','"+profile.emails[0].value+"')");
          }
          else
            {
              console.log("User already exists in database");
            }
          });
      return done(null, profile);
    });
  }
));
}
