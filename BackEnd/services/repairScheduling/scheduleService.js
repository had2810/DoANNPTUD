const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const EmployeeWorkSchedule = require("../../schemas/repairScheduling/employeeWork.model");
const availableTimeService = require("./availableTimeService");
const Appointment = require("../../schemas/repairScheduling/appointments.model");

const scheduleService = {
  getAvailableTimeByDate: async (dateStr) => {
    const availableTime = await availableTimeService.getAvailableTimeByDate(
      dateStr
    );
    return availableTime;
  },

  getAvailableTimeByMonth: async (monthStr) => {
    const availableTime = await availableTimeService.getAvailableTimeByMonth(
      monthStr
    );
    return availableTime;
  },

  getAnAvailableTime: async (employeeWorkScheduleId, dateStr) => {
    const availableTime = await availableTimeService.getAnAvailableTime(
      employeeWorkScheduleId,
      dateStr
    );
    return availableTime;
  },

  getAvailableConsultantTimes: async (employeeWorkScheduleId, dateStr) => {
    const availableTime =
      await availableTimeService.getAvailableConsultantTimes(
        employeeWorkScheduleId,
        dateStr
      );
    return availableTime;
  },

  getMonthSchedule: async (employeeId, monthStr) => {
    const startOfMonth = dayjs(`${monthStr}-01`).startOf("month").toDate();
    const endOfMonth = dayjs(`${monthStr}-01`).endOf("month").toDate();

    const schedules = await EmployeeWorkSchedule.find({
      employeeId,
      $or: [
        {
          startTime: { $lte: endOfMonth },
          endTime: { $gte: startOfMonth },
        },
        {
          appointmentId: { $exists: true, $ne: [] },
        },
      ],
    }).populate("appointmentId");

    const totalDays = dayjs(endOfMonth).date();
    const result = [];

    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${monthStr}-${String(day).padStart(2, "0")}`;
      const currentDateStr = dayjs(dateStr).format("YYYY-MM-DD");
      const currentDate = dayjs(currentDateStr).toDate();

      // Kiểm tra nếu ngày nằm trong excludedDates của bất kỳ lịch nào
      const isDayOff = schedules.some((w) =>
        (w.excludedDates || []).some((d) =>
          dayjs(d).utc().isSame(dayjs(currentDateStr), "day")
        )
      );

      // Nếu là ngày nghỉ, không cần kiểm tra thêm
      if (isDayOff) {
        result.push({
          date: currentDateStr,
          status: "off",
          appointmentCount: 0,
          availableTimesCount: 0,
        });
        continue;
      }

      // Lấy thông tin khung giờ trống từ availableTimeService
      const availableTime = await availableTimeService.getAnAvailableTime(
        schedules[0]?._id,
        currentDateStr
      );

      // Tổng số khung giờ làm việc trong một ngày (8:00 đến 17:00)
      const totalTimeSlots = 9;
      // Số khung giờ bận
      const busySlots = availableTime.busySlots?.length || 0;
      // Tính số khung giờ còn trống
      const availableTimesCount = totalTimeSlots - busySlots;

      // Tính số lượng cuộc hẹn theo ngày
      const appointmentCount = schedules
        .flatMap((w) => w.appointmentId || [])
        .filter(
          (appt) =>
            appt &&
            dayjs(appt.appointmentTime).format("YYYY-MM-DD") === currentDateStr
        ).length;

      // Xác định trạng thái dựa trên số lượng khung giờ trống
      let status = "available";
      if (availableTimesCount === 0) {
        status = "full";
      } else if (availableTimesCount <= 4) {
        status = "semi_busy";
      } else if (availableTimesCount > 4 && availableTimesCount <= 8) {
        status = "light_busy";
      }

      result.push({
        date: currentDateStr,
        status,
        appointmentCount,
        availableTimesCount,
      });
    }

    return result;
  },

  setDayOff: async (employeeId, dateStr) => {
    console.log("[setDayOff] Nhận yêu cầu nghỉ:", { employeeId, dateStr });
    const targetDate = dayjs(dateStr, "YYYY-MM-DD").startOf("day").toDate();
    console.log("[setDayOff] targetDate:", targetDate);

    const schedule = await EmployeeWorkSchedule.findOne({ employeeId });
    console.log(
      "[setDayOff] schedule:",
      schedule ? "Tìm thấy" : "Không tìm thấy"
    );

    if (!schedule) {
      return {
        success: false,
        message: "Không tìm thấy bản ghi lịch làm việc của nhân viên.",
      };
    }

    const alreadyExists = (schedule.excludedDates || []).some((d) =>
      dayjs(d).isSame(targetDate, "day")
    );
    console.log("[setDayOff] alreadyExists:", alreadyExists);

    if (!alreadyExists) {
      // Đảm bảo excludedDates là mảng
      if (!Array.isArray(schedule.excludedDates)) {
        schedule.excludedDates = [];
      }
      schedule.excludedDates.push(targetDate);
      schedule.markModified("excludedDates"); // rất quan trọng
      await schedule.save();

      // Cập nhật các đơn hàng trong ngày nghỉ
      const startOfDay = dayjs(dateStr).startOf("day").toDate();
      const endOfDay = dayjs(dateStr).endOf("day").toDate();
      console.log("[setDayOff] startOfDay:", startOfDay, "endOfDay:", endOfDay);

      // Log điều kiện tìm kiếm
      console.log("[setDayOff] Điều kiện tìm kiếm:", {
        employeeId,
        appointmentTime: { $gte: startOfDay, $lte: endOfDay },
      });

      const affectedAppointments = await Appointment.find({
        employeeId,
        appointmentTime: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });
      console.log(
        "[setDayOff] Các appointment tìm được:",
        affectedAppointments.map((a) => a._id.toString())
      );

      const result = await Appointment.updateMany(
        {
          employeeId,
          appointmentTime: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
        {
          $unset: { employeeId: "" },
        }
      );
      console.log(
        "[setDayOff] Số lượng appointment bị xóa employeeId:",
        result.modifiedCount
      );
    }

    return {
      success: true,
      message: `Đã thêm ngày nghỉ ${dateStr} vào excludedDates và cập nhật các đơn hàng.`,
    };
  },

  removeDayOff: async (employeeId, dateStr) => {
    const targetDate = dayjs(dateStr, "YYYY-MM-DD")
      .utc()
      .startOf("day")
      .toDate();

    const schedule = await EmployeeWorkSchedule.findOne({ employeeId });

    if (!schedule) {
      return {
        success: false,
        message: "Không tìm thấy bản ghi lịch làm việc của nhân viên.",
      };
    }

    const originalLength = schedule.excludedDates.length;

    schedule.excludedDates = schedule.excludedDates.filter(
      (d) => !dayjs(d).utc().isSame(targetDate, "day")
    );

    if (schedule.excludedDates.length < originalLength) {
      schedule.markModified("excludedDates");
      await schedule.save();

      return {
        success: true,
        message: `Đã xóa ngày nghỉ ${dateStr} khỏi excludedDates.`,
      };
    } else {
      return {
        success: false,
        message: `Ngày ${dateStr} không nằm trong danh sách nghỉ.`,
      };
    }
  },
};

module.exports = scheduleService;
