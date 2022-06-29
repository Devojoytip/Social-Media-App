const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/user_controller');
const homeController = require('../controllers/home_controller');

// router.get('/', usersController.users_home_fn);
router.get('/', homeController.home_fn);

//make profile page visible only when user is signed in
// STEP 12
router.get('/profile', passport.checkAuthentication, usersController.profile_fn);

router.get('/profile/:id', passport.checkAuthentication, usersController.profile_fn2);

router.post('/update-profile/:id', passport.checkAuthentication, usersController.update_profile);

router.get('/sign-up', usersController.users_signup);

router.get('/login', usersController.users_login);

router.post('/create', usersController.create);

//use passport as a middleware to authenticate
// STEP 11
router.post('/create-session', passport.authenticate(
    'local',
    { failureRedirect: '/users/login' }
), usersController.createSession);

router.get('/logout',usersController.destroySession);

// used to send request to google, scope- info we want from google
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));

// route at which i get info which google sends
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/login'}), usersController.createSession);

module.exports = router;

//ends