const express = require('express');
const { submitVote } = require('../controllers/voteController');
const { captureIP } = require('../middlewares/ipMiddleware');

const router = express.Router();

router.post('/', captureIP, submitVote);

module.exports = router;