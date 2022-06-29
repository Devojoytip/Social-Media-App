const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');
const env = require('./environment');

// let opts = {};
// opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = 'my secret key'; // shud be same as used in users_api as it will decrypt it
let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwt_secret // shud be same as used in users_api as it will decrypt it
};

// need not to use password as we use jwt_payload.id
passport.use(new JWTStrategy(opts, function (jwt_payload, done) {
    console.log('jwt_payload is ', jwt_payload);
    User.findById(jwt_payload._id, function (err, user) {
        if (err) {
            console.log('error in finding user', err);
            return ;
        }

        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    });
}));

module.exports = passport;