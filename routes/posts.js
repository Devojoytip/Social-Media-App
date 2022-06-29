const express = require('express');
const router = express.Router();
const passport = require('passport');

const postsController = require('../controllers/posts_controller');

//Check Authentication on Creating Post by adding passport.checkAuthentication
router.post('/create-post',passport.checkAuthentication,postsController.createPost);
router.get('/delete-post/:id',passport.checkAuthentication,postsController.deletePost);

module.exports = router;