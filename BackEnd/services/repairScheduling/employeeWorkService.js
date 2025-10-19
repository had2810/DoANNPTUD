const baseService = require("../baseService");
const EmployeeWorkSchedule = require("../../schemas/repairScheduling/employeeWork.model");

const base = baseService(EmployeeWorkSchedule, {
  populateFields: ["appointmentId", "employeeId"],
});
const employeeWorkService = {
  ...base,
  async findMany(filter = {}) {
    return EmployeeWorkSchedule.find(filter).populate([
      {
        path: "employeeId",
        select: "-password -refreshToken",
      },
      {
        path: "appointmentId",
        populate: [
          { path: "userId", select: "-password -refreshToken" },
          { path: "deviceTemplateId" },
          { path: "serviceId" },
        ],
      },
    ]);
  },

  // Tạo lịch làm việc theo tuần
  async createWeeklySchedule(employeeId, weekStartDate, workDays, status = "Đang trực") {
    const dayjs = require("dayjs");
    
    // Tính ngày kết thúc tuần (Chủ nhật)
    const weekEndDate = dayjs(weekStartDate).add(6, 'day');
    
    // Kiểm tra xem đã có lịch cho tuần này chưa
    const existingSchedule = await EmployeeWorkSchedule.findOne({
      employeeId,
      weekStartDate: dayjs(weekStartDate).toDate(),
      weekEndDate: weekEndDate.toDate(),
    });

    if (existingSchedule) {
      // Update lịch hiện có
      existingSchedule.workDays = workDays;
      existingSchedule.status = status;
      return await existingSchedule.save();
    } else {
      // Tạo lịch mới
      return await EmployeeWorkSchedule.create({
        employeeId,
        weekStartDate: dayjs(weekStartDate).toDate(),
        weekEndDate: weekEndDate.toDate(),
        workDays,
        status,
      });
    }
  },

  // Lấy lịch làm việc theo tuần
  async getWeeklySchedule(employeeId, weekStartDate) {
    const dayjs = require("dayjs");
    
    return await EmployeeWorkSchedule.findOne({
      employeeId,
      weekStartDate: dayjs(weekStartDate).toDate(),
    }).populate([
      {
        path: "employeeId",
        select: "-password -refreshToken",
      },
      {
        path: "appointmentId",
        populate: [
          { path: "userId", select: "-password -refreshToken" },
          { path: "deviceTemplateId" },
          { path: "serviceId" },
        ],
      },
    ]);
  },
};

module.exports = employeeWorkService;
