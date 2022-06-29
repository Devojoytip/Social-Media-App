const express = require('express');
const router=express.Router();
const LikeController=require('../controllers/like_controller');

router.get('/toggle',LikeController.likefn);

module.exports = router;