const mongoose = require("mongoose");

const partSchema = new mongoose.Schema(
  {
    partName: { type: String, required: true },
    type: { type: String },
    imageUrl: { type: String },
    description: { type: String },
    price: { type: String }, // hoặc Number nếu dùng số
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Part = mongoose.model("Part", partSchema);
module.exports = Part;
