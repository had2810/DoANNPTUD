const mongoose = require("mongoose");

const deviceTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Laptop", "Phone", "Tablet", "PC", "Other"], // tuỳ bạn mở rộng
    },
    brand: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const DeviceTemplate = mongoose.model("DeviceTemplate", deviceTemplateSchema);
module.exports = DeviceTemplate;
