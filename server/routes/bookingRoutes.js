const express = require('express');
const router = express.Router();
const { createBooking, updateBookingStatus, getMyBookings, getOwnerBookings } = require('../controllers/bookingController');
const protect = require('../middleware/protect');

router.post('/', protect, createBooking);
router.put('/:id', protect, updateBookingStatus);
router.get('/my', protect, getMyBookings);
router.get('/owner', protect, getOwnerBookings);

module.exports = router;