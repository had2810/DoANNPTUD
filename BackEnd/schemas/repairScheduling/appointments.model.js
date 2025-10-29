const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const appointmentSchema = new mongoose.Schema(
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

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User with role = 2 (Employee)
    },

    appointmentTime: { type: Date, required: true },
    description: { type: String, required: true },
    imageUrls: { type: [String], default: [] },
    estimatedCost: { type: Number },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    orderCode: {
      type: String,
      unique: true,
      required: true,
    },
  isDeleted: { type: Boolean, default: false },
  // Payment fields

  },
  { timestamps: true }
);

appointmentSchema.pre("validate", function (next) {
  if (!this.orderCode) {
    this.orderCode = `ORD-${nanoid(6).toUpperCase()}`;
  }
  next();
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
