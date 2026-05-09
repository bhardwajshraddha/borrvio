const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalDays: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  depositAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Requested', 'Accepted', 'Active', 'Completed', 'Cancelled'],
    default: 'Requested'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refunded', 'Partially Refunded'],
    default: 'Pending'
  },
  depositStatus: {
    type: String,
    enum: ['Held', 'Refunded', 'Partially Deducted', 'Disputed'],
    default: 'Held'
  },
  conditionOnReturn: {
    type: String,
    enum: ['Good', 'Minor Damage', 'Major Damage'],
    default: null
  },
  beforePhotos: [{ type: String }],
  afterPhotos: [{ type: String }],
  disputeFlag: {
    type: Boolean,
    default: false
  },
  razorpayOrderId: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);