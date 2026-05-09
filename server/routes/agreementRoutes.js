const express = require('express');
const router = express.Router();
const { generateAgreement, getAgreement } = require('../controllers/agreementController');
const protect = require('../middleware/protect');

router.post('/:bookingId', protect, generateAgreement);
router.get('/:bookingId', protect, getAgreement);

module.exports = router;