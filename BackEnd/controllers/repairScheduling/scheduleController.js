import scheduleService from "../../services/repairScheduling/scheduleService.js";

const scheduleController = {
  getAvailableTimeByDate: async (req, res) => {
    try {
      const { date } = req.query;
      const availableTime = await scheduleService.getAvailableTimeByDate(date);
      console.log(availableTime);
      res.status(200).json(availableTime);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAvailableTimeByMonth: async (req, res) => {
    try {
      const { month } = req.query;
      const availableTime = await scheduleService.getAvailableTimeByMonth(
        month
      );
      res.status(200).json(availableTime);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAnAvailableTime: async (req, res) => {
    try {
      const { employeeWorkScheduleId, date } = req.query;
      const availableTime = await scheduleService.getAnAvailableTime(
        employeeWorkScheduleId,
        date
      );
      res.status(200).json(availableTime);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getMonthSchedule: async (req, res) => {
    try {
      const { employeeId, month: monthStr } = req.query;
      const data = await scheduleService.getMonthSchedule(employeeId, monthStr);
      res.status(200).json({
        message: "Lịch làm việc tháng đã được lấy thành công.",
        data: data,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy lịch làm việc tháng.",
        error: error.message,
      });
    }
  },

  getAvailableConsultantTimes: async (req, res) => {
    try {
      const { employeeWorkScheduleId, date } = req.query;
      const availableTime = await scheduleService.getAvailableConsultantTimes(
        employeeWorkScheduleId,
        date
      );
      res.status(200).json(availableTime);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  setDayOff: async (req, res) => {
    try {
      const { employeeId, dateStr } = req.body;
      const result = await scheduleService.setDayOff(employeeId, dateStr);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi thiết lập ngày nghỉ.",
        error: error.message,
      });
    }
  },

  removeDayOff: async (req, res) => {
    try {
      const { employeeId, dateStr } = req.body;
      const result = await scheduleService.removeDayOff(employeeId, dateStr);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi xóa ngày nghỉ.",
        error: error.message,
      });
    }
  },
};

export default scheduleController;
