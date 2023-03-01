const express = require('express');
const router = express.Router();
const apiRouter = require('./apiRoutes')

router.use('/api', apiRouter);
module.exports = router;
