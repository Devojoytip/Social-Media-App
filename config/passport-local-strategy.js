const passport = require('passport');

const User = require('../models/user');

const LocalStrategy = require('passport-local').Strategy;

// STEP 1 after installation of passport
//authentication fn
passport.use(new LocalStrategy(
    {
        usernameField: 'email'
    },
    function (email, password, done) {
        //done is callback fn
        //find user & establish the identity
        User.findOne({ email: email }, (err, user) => {
            if (err) {
                console.log('Error in finding user');
                return done(err);
            }

            if (!user || user.password !== password) {
                console.log('Invalid Email/Password');
                //2 args - err, user
                return done(null, false);
            }

            else return done(null, user);
        });
    }
));

//https://hackernoon.com/passportjs-the-confusing-parts-explained-edca874ebead

//serialising the user- storing user info into cookie
// Serializing a user determines which data of the user object should be stored in the session cookie, usually the user id This function then calls done(null, user.id)

// STEP 2
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//deserialise the user from cookie
// deserializeUser(), the first argument is an id which is the same id that was passed in done(null, user.id) of serializeUser(). deserializeUser() then makes a request to our DB to find the full profile information for the user and then calls done(null, user)

// STEP 3
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        if (err) {
            console.log('Error in finding user');
            return done(err);
        }
        else{
            console.log('Deserialize user called.');
            return done(null, user);
        }
    })
})

//middleware to check if user is authenticated
// STEP 4
passport.checkAuthentication = (req, res, next) => {
    //if user is signed in then pass on the req to the next fn(controller's action)
    if (req.isAuthenticated()) {
        return next();
    }

    //if user is not signed
    else {
        return res.redirect('/users/login');
    }
}

// STEP 5
passport.setAuthenticatedUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        //req.user contains current signed in user from session cookie & we r just sending this to the locals for views
        res.locals.user = req.user;
    }
    next();
}

// STEP 6 in index.js

module.exports = passport;

