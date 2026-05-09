const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  city: {
    type: String,
    default: ''
  },
  area: {
    type: String,
    default: ''
  },
  phone: {
  type: String,
  default: ''
},
  profileImage: {
    type: String,
    default: ''
  },
  trustScore: {
    type: Number,
    default: 100
  },
  totalRentalsAsOwner: {
    type: Number,
    default: 0
  },
  totalRentalsAsRenter: {
    type: Number,
    default: 0
  },
  cancellationCount: {
    type: Number,
    default: 0
  },
  damageCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);