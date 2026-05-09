const Rating = require('../models/Rating');
const Booking = require('../models/Booking');
const User = require('../models/User');

// Give Rating
const giveRating = async (req, res) => {
  try {
    const { bookingId, toUserId, stars, comment, ratingType } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.status !== 'Completed') {
      return res.status(400).json({ message: 'Can only rate after booking is completed' });
    }

    // Check already rated
    const alreadyRated = await Rating.findOne({
      booking: bookingId,
      fromUser: req.user._id,
      ratingType
    });

    if (alreadyRated) {
      return res.status(400).json({ message: 'Already rated for this booking' });
    }

    const rating = await Rating.create({
      booking: bookingId,
      fromUser: req.user._id,
      toUser: toUserId,
      stars,
      comment,
      ratingType
    });

    // Update user average rating
    const allRatings = await Rating.find({ toUser: toUserId });
    const avgRating = allRatings.reduce((acc, r) => acc + r.stars, 0) / allRatings.length;

    await User.findByIdAndUpdate(toUserId, { averageRating: avgRating.toFixed(1) });

    // Update Trust Score
    const user = await User.findById(toUserId);
    const trustScore = Math.min(100, Math.max(0,
      (avgRating * 15) +
      (user.totalRentalsAsRenter * 2) -
      (user.cancellationCount * 10) -
      (user.damageCount * 15)
    ));

    await User.findByIdAndUpdate(toUserId, { trustScore });

    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Ratings of a User
const getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ toUser: req.params.userId })
      .populate('fromUser', 'name');

    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { giveRating, getUserRatings };