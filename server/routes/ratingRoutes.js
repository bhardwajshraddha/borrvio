const express = require('express');
const router = express.Router();
const { giveRating, getUserRatings } = require('../controllers/ratingController');
const protect = require('../middleware/protect');

router.post('/', protect, giveRating);
router.get('/:userId', getUserRatings);

module.exports = router;