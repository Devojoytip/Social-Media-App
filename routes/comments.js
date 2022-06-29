const express = require('express');
const router=express.Router();
const passport = require('passport');

const commentsController=require('../controllers/comments_controller');

router.post('/create-comment',passport.checkAuthentication,commentsController.create_comment);

router.get('/delete-comment/:id',passport.checkAuthentication,commentsController.delete_comment);

module.exports = router;