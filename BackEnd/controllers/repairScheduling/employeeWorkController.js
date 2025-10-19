const baseController = require("../baseController");
const employeeWorkService = require("../../services/repairScheduling/employeeWorkService");

const base = baseController(employeeWorkService);
const employeeWorkController = {
  createEmployeeWork: base.create,
  getEmployeeWork: base.getAll,
  getMyEmployeeWork: async (req, res) => {
    try {
      const { role, id } = req.user;
      let filter = {};

      if (role === 2 || role === 3) {
        filter = { employeeId: id };
      }

      console.log(">>> USER INFO:", req.user);
      console.log(">>> FILTER:", filter);

      const employeeWork = await employeeWorkService.findMany(filter);
      res.status(200).json({ data: employeeWork });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lịch làm việc:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  },
  getEmployeeWorkById: base.getById,
  updateEmployeeWork: base.update,
  deleteEmployeeWork: base.delete,

  // Tạo lịch làm việc theo tuần
  createWeeklySchedule: async (req, res) => {
    try {
      const { employeeId, weekStartDate, workDays, status } = req.body;
      
      console.log("=== CREATE WEEKLY SCHEDULE ===");
      console.log("employeeId:", employeeId);
      console.log("weekStartDate:", weekStartDate);
      console.log("workDays:", workDays);
      console.log("status:", status);
      
      const schedule = await employeeWorkService.createWeeklySchedule(
        employeeId,
        weekStartDate,
        workDays,
        status
      );
      
      console.log("=== SCHEDULE CREATED ===");
      console.log("Created schedule:", schedule);
      
      res.status(200).json({
        message: "Tạo lịch làm việc theo tuần thành công",
        data: schedule,
      });
    } catch (error) {
      console.error("Lỗi khi tạo lịch làm việc theo tuần:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  },

  // Lấy lịch làm việc theo tuần
  getWeeklySchedule: async (req, res) => {
    try {
      console.log("=== GET WEEKLY SCHEDULE ===");
      console.log("req.query:", req.query);
      console.log("req.user:", req.user);
      
      const { weekStartDate, employeeId } = req.query; // Vẫn lấy employeeId từ query để debug
      const employeeIdFromUser = req.user.id; // Lấy từ user đã authenticate
      
      console.log("employeeId from query:", employeeId);
      console.log("employeeId from user:", employeeIdFromUser);
      console.log("weekStartDate:", weekStartDate);
      
      if (!weekStartDate) {
        return res.status(400).json({ message: "weekStartDate is required" });
      }
      
      if (!employeeIdFromUser) {
        return res.status(400).json({ message: "employeeId is required" });
      }
      
      console.log("Calling service with employeeId:", employeeIdFromUser, "weekStartDate:", weekStartDate);
      
      // Sử dụng employeeId từ user thay vì từ query
      const schedule = await employeeWorkService.getWeeklySchedule(
        employeeIdFromUser,
        weekStartDate
      );
      
      console.log("=== SERVICE RETURNED ===");
      console.log("Schedule found:", !!schedule);
      if (schedule) {
        console.log("Schedule details:", {
          id: schedule._id,
          weekStartDate: schedule.weekStartDate,
          weekEndDate: schedule.weekEndDate,
          workDays: schedule.workDays,
          workDaysCount: schedule.workDays?.length
        });
      }
      
      res.status(200).json({
        message: "Lấy lịch làm việc theo tuần thành công",
        data: schedule,
      });
    } catch (error) {
      console.error("Lỗi khi lấy lịch làm việc theo tuần:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
};

module.exports = employeeWorkController;
