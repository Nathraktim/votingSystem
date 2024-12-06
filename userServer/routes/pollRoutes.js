const express = require('express');
const { createPoll, getPolls } = require('../controllers/pollController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticate, createPoll);
router.get('/', authenticate, getPolls);

module.exports = router;