const mongoose = require("mongoose");

const employeeWorkScheduleSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User with role = 2 (Employee)
      required: true,
    },
    
    // Tuần làm việc
    weekStartDate: { type: Date, required: true }, // Thứ 2 đầu tuần
    weekEndDate: { type: Date, required: true },   // Chủ nhật cuối tuần
    
    // Ngày làm việc trong tuần
    workDays: [{
      dayOfWeek: { 
        type: Number, 
        required: true,
        min: 1, max: 7 // 1=CN, 2=T2, 3=T3, 4=T4, 5=T5, 6=T6, 7=T7
      },
      startHour: { type: String, default: "08:00" },
      endHour: { type: String, default: "17:00" }
    }],

    // Ngày nghỉ đặc biệt trong tuần
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
