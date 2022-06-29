const express = require('express');
const passport = require('passport');
const router = express.Router();

const postsApi = require('../../../controllers/api/v1/posts_api');

router.get('/', postsApi.index);

// session:false as we dont want to generate session cookies
router.delete('/:id', passport.authenticate('jwt', { session: false }), postsApi.deletePost);

module.exports = router;