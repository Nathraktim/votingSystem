const express = require('express');
const { receiveVote, getResults } = require('../controllers/voteController');
const router = express.Router();
router.post('/receiveVote', receiveVote);
router.get('/results/:eventId', getResults);

module.exports = router;