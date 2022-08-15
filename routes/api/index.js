const router = require('express').Router();
// /api/account/*
router.use('/account', require('./account'));
// /api/file/*
router.use('/file', require('./file'));
module.exports = router;