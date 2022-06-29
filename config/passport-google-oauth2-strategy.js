const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');

// https://www.passportjs.org/packages/passport-google-oauth2/

// new google strategy
passport.use(new googleStrategy({
    clientID: env.google_client_ID,
    clientSecret: env.google_client_Secret,
    callbackURL: env.google_callback_URL,
    passReqToCallback: true
},
    // callback fn
    function (req, accessToken, refreshToken, profile, done) {
        // as an user can have multiple email ids so array of email
        // find user
        User.findOne({ email: profile.emails[0].value }).exec((err, user) => {

            if (err) {
                console.log('Error in google strategy-passport', err);
                return;
            }

            console.log('profile is',profile);
            console.log('accessToken is',accessToken);
            console.log('refreshToken is',refreshToken); //unless we ask for it we will not get

            if (user) {
                // if user found set as req.user ie sign in that user
                return done(null, user);
            }

            // if user not found then create user & set as req.user (ie sign in that user )
            else {
                User.create({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex') // used cryptojs crypto.randomBytes(length).toString('format') for generating random password
                }, (err, user) => {

                    if (err) {
                        console.log('Error in google strategy-passport', err);
                        return;
                    }

                    return done(null, user);
                });
            }
        });
    }
));

module.exports = passport;