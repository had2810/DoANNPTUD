const mongoose = require("mongoose");

const partsInventorySchema = new mongoose.Schema(
  {
    partId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Part",
      required: true,
    },
    stockQuantity: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PartsInventory = mongoose.model("PartsInventory", partsInventorySchema);
module.exports = PartsInventory;
