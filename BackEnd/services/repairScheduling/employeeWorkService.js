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

  // Lấy lịch làm việc theo tuần (tìm tuần có chứa ngày được yêu cầu)
  async getWeeklySchedule(employeeId, weekStartDate) {
    const dayjs = require("dayjs");
    const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
    const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
    
    dayjs.extend(isSameOrAfter);
    dayjs.extend(isSameOrBefore);
    
    const requestedDate = dayjs(weekStartDate);
    
    console.log("getWeeklySchedule - Looking for week containing:", requestedDate.format('YYYY-MM-DD'));
    
    // Tìm tuần có chứa ngày được yêu cầu
    const schedule = await EmployeeWorkSchedule.findOne({
      employeeId,
      weekStartDate: { $lte: requestedDate.toDate() },
      weekEndDate: { $gte: requestedDate.toDate() },
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
    
    console.log("getWeeklySchedule - Found schedule:", schedule ? {
      id: schedule._id,
      weekStartDate: schedule.weekStartDate,
      weekEndDate: schedule.weekEndDate,
      workDays: schedule.workDays
    } : null);
    
    return schedule;
  },
};

module.exports = employeeWorkService;
