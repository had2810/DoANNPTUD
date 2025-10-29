const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    deviceTemplateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeviceTemplate",
      required: true,
    },
    serviceName: { type: String, required: true },
    serviceType: { type: String, required: true },
    imageUrl: { type: String },
    estimatedDuration: { type: Number, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
