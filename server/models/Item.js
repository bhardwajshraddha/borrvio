const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Electronics",
        "Vehicles",
        "Clothing",
        "Sports",
        "Tools",
        "Furniture",
        "Jewellery",
        "Other",
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [{ type: String }],
    pricePerDay: {
      type: Number,
      required: true,
    },
    securityDeposit: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    blockedDates: [
      {
        startDate: Date,
        endDate: Date,
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    address: {
      type: String,
      default: "",
    },
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Item", itemSchema);
