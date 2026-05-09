const express = require('express');
const router = express.Router();
const { getOwnerDashboard, getRenterDashboard } = require('../controllers/dashboardController');
const protect = require('../middleware/protect');

router.get('/owner', protect, getOwnerDashboard);
router.get('/renter', protect, getRenterDashboard);

module.exports = router;