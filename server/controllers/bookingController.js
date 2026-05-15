const Booking = require("../models/Booking");
const Item = require("../models/Item");
const User = require("../models/User");
const Agreement = require("../models/Agreement");

const {
  sendBookingRequestEmail,
  sendBookingAcceptedEmail,
  sendBookingCancelledEmail,
} = require("./emailController");

// Create Booking
const createBooking = async (req, res) => {
  try {
    const { itemId, startDate, endDate } = req.body;

    const item = await Item.findById(itemId).populate("owner", "name email");
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.owner._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot rent your own item" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const conflict = await Booking.findOne({
      item: itemId,
      status: { $in: ["Requested", "Accepted", "Active"] },
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
    });

    if (conflict) {
      return res
        .status(400)
        .json({ message: "Item not available for selected dates" });
    }

    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalAmount = totalDays * item.pricePerDay;
    const depositAmount = item.securityDeposit;

    const booking = await Booking.create({
      item: itemId,
      owner: item.owner._id,
      renter: req.user._id,
      startDate: start,
      endDate: end,
      totalDays,
      totalAmount,
      depositAmount,
      status: "Requested",
    });

    // Send email to owner
    console.log("Sending email to:", item.owner.email);
    const renter = await User.findById(req.user._id);
    console.log("Renter name:", renter.name);

    await sendBookingRequestEmail(
      item.owner.email,
      item.owner.name,
      item.name,
      renter.name,
    );

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Booking Status
const updateBookingStatus = async (req, res) => {
  try {
    const { status, conditionOnReturn } = req.body;

    const booking = await Booking.findById(req.params.id)
      .populate("owner", "name email")
      .populate("renter", "name email")
      .populate("item", "name");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (status === "Accepted" || status === "Cancelled") {
      if (booking.owner._id.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
      }
    }

    // ✅ ACCEPTED — Agreement ek baar banao + email bhejo
    if (status === "Accepted") {
      const agreementId = `AGR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      await Agreement.create({
        booking: booking._id,
        agreementId,
        ownerName: booking.owner.name,
        renterName: booking.renter.name,
        itemName: booking.item.name,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalAmount: booking.totalAmount,
        depositAmount: booking.depositAmount,
        pdfUrl: null, // Cloudinary se generate hoga
      });

      await sendBookingAcceptedEmail(
        booking.renter.email,
        booking.renter.name,
        booking.item.name,
      );
    }

    // ✅ CANCELLED — email bhejo
    if (status === "Cancelled") {
      await sendBookingCancelledEmail(
        booking.renter.email,
        booking.renter.name,
        booking.item.name,
      );
    }

    // ✅ COMPLETED — deposit status update karo
    if (status === "Completed" && conditionOnReturn) {
      booking.conditionOnReturn = conditionOnReturn;

      if (conditionOnReturn === "Good") {
        booking.depositStatus = "Refunded";
      } else if (conditionOnReturn === "Minor Damage") {
        booking.depositStatus = "Partially Deducted";
      } else if (conditionOnReturn === "Major Damage") {
        booking.depositStatus = "Disputed";
      }
    }

    booking.status = status;
    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Bookings (Renter)
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ renter: req.user._id })
      .populate("item", "name images pricePerDay city")
      .populate("owner", "name city");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Owner Bookings
const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate("item", "name images pricePerDay city")
      .populate("renter", "name city trustScore");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  updateBookingStatus,
  getMyBookings,
  getOwnerBookings,
};
