const mongoose = require("mongoose");

const repairStatusSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Checking",
        "In Repair",
        "Waiting for Customer",
        "Completed",
        "Cancelled",
      ],
      default: "Checking",
      required: true,
    },

    statusLog: [
      {
        status: {
          type: String,
          enum: [
            "Checking",
            "In Repair",
            "Waiting for Customer",
            "Completed",
            "Cancelled",
          ],
          default: "Checking",
        },
        time: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    estimatedCompletionTime: {
      type: Date,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const RepairStatus = mongoose.model("RepairStatus", repairStatusSchema);
module.exports = RepairStatus;
