const Wishlist = require('../models/Wishlist');

// Add to Wishlist
const addToWishlist = async (req, res) => {
  try {
    const { itemId } = req.body;

    const already = await Wishlist.findOne({ renter: req.user._id, item: itemId });
    if (already) return res.status(400).json({ message: 'Already in wishlist' });

    const wishlist = await Wishlist.create({
      renter: req.user._id,
      item: itemId
    });

    res.status(201).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Wishlist
const getMyWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ renter: req.user._id })
      .populate('item', 'name images pricePerDay city isAvailable');

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from Wishlist
const removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ renter: req.user._id, item: req.params.itemId });
    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addToWishlist, getMyWishlist, removeFromWishlist };