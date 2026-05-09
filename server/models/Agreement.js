const mongoose = require('mongoose');

const agreementSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  agreementId: {
    type: String,
    unique: true,
    required: true
  },
  ownerName: { type: String, required: true },
  renterName: { type: String, required: true },
  itemName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
  depositAmount: { type: Number, required: true },
  pdfUrl: { type: String, default: '' },
  generatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Agreement', agreementSchema);