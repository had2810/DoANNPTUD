const mongoose = require("mongoose");

const partsWaitingListSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    partId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Part",
      required: true,
    },
    quantity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Waiting", "Available"],
      default: "Waiting",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PartsWaitingList = mongoose.model(
  "PartsWaitingList",
  partsWaitingListSchema
);
module.exports = PartsWaitingList;
