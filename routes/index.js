const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home_controller');

console.log('Router loaded !');

// if url is /
router.get('/', homeController.home_fn);

// url - /users
router.use('/users',require('./users'));

router.use('/posts',require('./posts'));

router.use('/comments',require('./comments'));

router.use('/api',require('./api'));

router.use('/likes',require('./likes'));

router.use('/friendships',require('./friendships'));

//own
// router.use('/signup',require('./signup_page'));

// router.use('/login',require('./login_page'));

module.exports = router;