const express = require('express');
const { allocateEvent } = require('../controllers/allocatorController');

const router = express.Router();
router.post('/allocate', allocateEvent);

module.exports = router;