const express = require('express');
const router = express.Router();

// version 1
router.use('/v1',require('./v1'));

// version 2
router.use('/v2',require('./v2'));

module.exports = router;