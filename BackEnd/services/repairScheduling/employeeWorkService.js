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
    
    console.log("=== CREATE WEEKLY SCHEDULE SERVICE ===");
    console.log("employeeId:", employeeId);
    console.log("weekStartDate:", weekStartDate);
    console.log("workDays:", workDays);
    console.log("status:", status);
    
    // Tính ngày kết thúc tuần (Chủ nhật)
    const weekEndDate = dayjs(weekStartDate).add(6, 'day');
    console.log("weekEndDate:", weekEndDate.format('YYYY-MM-DD'));
    
    // Kiểm tra xem đã có lịch cho tuần này chưa
    const existingSchedule = await EmployeeWorkSchedule.findOne({
      employeeId,
      weekStartDate: dayjs(weekStartDate).toDate(),
      weekEndDate: weekEndDate.toDate(),
    });

    console.log("Existing schedule found:", !!existingSchedule);

    if (existingSchedule) {
      // Update lịch hiện có
      console.log("Updating existing schedule");
      existingSchedule.workDays = workDays;
      existingSchedule.status = status;
      const updatedSchedule = await existingSchedule.save();
      console.log("Updated schedule:", updatedSchedule);
      return updatedSchedule;
    } else {
      // Tạo lịch mới
      console.log("Creating new schedule");
      const newSchedule = await EmployeeWorkSchedule.create({
        employeeId,
        weekStartDate: dayjs(weekStartDate).toDate(),
        weekEndDate: weekEndDate.toDate(),
        workDays,
        status,
      });
      console.log("Created new schedule:", newSchedule);
      return newSchedule;
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
    
    console.log("=== GET WEEKLY SCHEDULE SERVICE ===");
    console.log("employeeId:", employeeId);
    console.log("requestedDate:", requestedDate.format('YYYY-MM-DD'));
    
        // Convert employeeId to ObjectId if it's a string
        const employeeObjectId = typeof employeeId === 'string' ? mongoose.Types.ObjectId(employeeId) : employeeId;
    
        // Tìm chính xác lịch làm việc của nhân viên trong tuần
        const schedule = await EmployeeWorkSchedule.findOne({
          employeeId: employeeObjectId,
          weekStartDate: {
            $gte: requestedDate.startOf('week').toDate(),
            $lte: requestedDate.startOf('week').endOf('day').toDate()
          },
          isDeleted: false
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
    
    console.log("=== SCHEDULE QUERY RESULT ===");
    console.log("Schedule found:", !!schedule);
    if (schedule) {
      console.log("Schedule details:", {
        id: schedule._id,
        weekStartDate: schedule.weekStartDate,
        weekEndDate: schedule.weekEndDate,
        workDays: schedule.workDays,
        workDaysCount: schedule.workDays?.length
      });
    } else {
      console.log("No schedule found for employeeId:", employeeId, "date:", requestedDate.format('YYYY-MM-DD'));
    }
    
    return schedule;
  },
};

module.exports = employeeWorkService;
