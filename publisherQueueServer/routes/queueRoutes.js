const express = require('express');
const {
    addEvent,
    getUnresolvedEvents,
    markEventResolved,
} = require('../controllers/queueController');

const router = express.Router();

router.post('/', addEvent);
router.get('/unresolved', getUnresolvedEvents);
router.patch('/:eventId/resolve', markEventResolved);

module.exports = router;