const express = require('express');
const router = express.Router();
const { addToWishlist, getMyWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const protect = require('../middleware/protect');

router.post('/', protect, addToWishlist);
router.get('/', protect, getMyWishlist);
router.delete('/:itemId', protect, removeFromWishlist);

module.exports = router;