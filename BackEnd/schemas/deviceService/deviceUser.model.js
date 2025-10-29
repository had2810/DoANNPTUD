const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deviceTemplateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeviceTemplate",
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    image_url: {
      type: String,
      default: "",
    },
    repairStatus: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Device = mongoose.model("Device", deviceSchema);
module.exports = Device;
