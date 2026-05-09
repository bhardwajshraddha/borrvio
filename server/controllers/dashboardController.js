const Booking = require('../models/Booking');
const Item = require('../models/Item');

// Owner Dashboard
const getOwnerDashboard = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate('item', 'name pricePerDay')
      .populate('renter', 'name');

    const totalEarnings = bookings
      .filter(b => b.status === 'Completed')
      .reduce((acc, b) => acc + b.totalAmount, 0);

    const activeRentals = bookings.filter(b => b.status === 'Active').length;
    const completedRentals = bookings.filter(b => b.status === 'Completed').length;
    const pendingRequests = bookings.filter(b => b.status === 'Requested').length;

    const myItems = await Item.find({ owner: req.user._id });

    res.status(200).json({
      totalEarnings,
      activeRentals,
      completedRentals,
      pendingRequests,
      totalItems: myItems.length,
      recentBookings: bookings.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Renter Dashboard
const getRenterDashboard = async (req, res) => {
  try {
    const bookings = await Booking.find({ renter: req.user._id })
      .populate('item', 'name pricePerDay city')
      .populate('owner', 'name');

    const activeBookings = bookings.filter(b => b.status === 'Active').length;
    const completedBookings = bookings.filter(b => b.status === 'Completed').length;
    const pendingBookings = bookings.filter(b => b.status === 'Requested').length;
    const totalSpent = bookings
      .filter(b => b.status === 'Completed')
      .reduce((acc, b) => acc + b.totalAmount, 0);

    res.status(200).json({
      activeBookings,
      completedBookings,
      pendingBookings,
      totalSpent,
      recentBookings: bookings.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOwnerDashboard, getRenterDashboard };