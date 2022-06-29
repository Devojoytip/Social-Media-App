const express = require('express');
const router=express.Router();
const FriendshipController=require('../controllers/friendships_controller');

router.get('/',FriendshipController.friendship_fn);

module.exports = router;