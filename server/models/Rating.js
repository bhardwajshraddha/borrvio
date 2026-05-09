const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    default: ''
  },
  ratingType: {
    type: String,
    enum: ['Owner-to-Renter', 'Renter-to-Owner', 'Renter-to-Item'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Rating', ratingSchema);