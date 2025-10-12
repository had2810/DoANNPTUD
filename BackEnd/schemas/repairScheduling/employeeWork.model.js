const mongoose = require("mongoose");

const employeeWorkScheduleSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User with role = 2 (Employee)
      required: true,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    startHour: { type: String },
    endHour: { type: String },

    excludedDates: [{ type: Date }],
    appointmentId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    status: {
      type: String,
      enum: ["Đang trực", "Bận", "Nghỉ"],
      default: "Đang trực",
    },
    note: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const EmployeeWorkSchedule = mongoose.model(
  "EmployeeWorkSchedule",
  employeeWorkScheduleSchema
);

module.exports = EmployeeWorkSchedule;
