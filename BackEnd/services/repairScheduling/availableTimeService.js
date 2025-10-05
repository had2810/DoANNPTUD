import dayjs from "dayjs";
import Appointment from "../../models/repairScheduling/appointments.model.js";
import EmployeeWorkSchedule from "../../models/repairScheduling/employeeWork.model.js";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const availableTimeService = {
  async getAvailableTimeByDate(dateStr) {
    const date = dayjs(dateStr);
    const startOfDay = date.startOf("day").toDate();
    const endOfDay = date.endOf("day").toDate();

    // Lấy tất cả lịch trực đang hoạt động, bỏ qua ngày nghỉ
    const shifts = await EmployeeWorkSchedule.find({
      status: "Đang trực",
      excludedDates: { $nin: [startOfDay] },
    })
      .populate({
        path: "employeeId",
        match: { role: 2 },
        select: "fullName role",
      })
      .populate({
        path: "appointmentId",
        populate: { path: "serviceId" },
      });

    // Lọc bỏ các ca làm việc không có employeeId (do không match với role == 2)
    const validShifts = shifts.filter((shift) => shift.employeeId);

    // Khung giờ làm việc mặc định mỗi ngày
    const slotList = [];
    for (let hour = 8; hour < 17; hour++) {
      slotList.push(`${hour.toString().padStart(2, "0")}:00`);
    }

    const busySlotMap = {};

    for (const shift of validShifts) {
      const techName = shift.employeeId?.fullName || "Kỹ thuật viên";
      const shiftStart = new Date(
        `${dateStr}T${shift.startHour || "08:00"}:00`
      );
      const shiftEnd = new Date(`${dateStr}T${shift.endHour || "17:00"}:00`);

      for (const slot of slotList) {
        const slotTime = new Date(`${dateStr}T${slot}:00`);

        if (slotTime < shiftStart || slotTime >= shiftEnd) continue;

        const isBusy = (shift.appointmentId || []).some((appt) => {
          if (!appt.appointmentTime) return false;
          const apptDate = dayjs(appt.appointmentTime).format("YYYY-MM-DD");
          if (apptDate !== dateStr) return false;

          const bufferTime = 15;
          const apptStart = appt.appointmentTime;
          const duration =
            (appt.serviceId?.estimatedDuration || 60) + bufferTime;
          const apptEnd = new Date(apptStart.getTime() + duration * 60000);
          return slotTime >= apptStart && slotTime < apptEnd;
        });

        if (isBusy) {
          if (!busySlotMap[slot]) busySlotMap[slot] = [];
          busySlotMap[slot].push(techName);
        }
      }
    }

    // Tìm các khung giờ còn ít nhất 1 người rảnh
    const availableTimes = slotList.filter((slot) => {
      const busyCount = busySlotMap[slot]?.length || 0;
      return busyCount < validShifts.length;
    });

    return {
      availableTimes,
      shifts: validShifts,
      fullSlots: busySlotMap,
    };
  },

  async getAvailableTimeByMonth(monthStr) {
    const date = dayjs(monthStr);
    const daysInMonth = date.daysInMonth();
    const result = {};

    // Khung giờ làm việc mặc định mỗi ngày
    const slotList = [];
    for (let hour = 8; hour < 17; hour++) {
      slotList.push(`${hour.toString().padStart(2, "0")}:00`);
    }

    // Lấy tất cả lịch trực đang hoạt động trong tháng của kỹ thuật viên (role == 2)
    const shifts = await EmployeeWorkSchedule.find({
      status: "Đang trực",
    })
      .populate({
        path: "employeeId",
        match: { role: 2 },
        select: "fullName role",
      })
      .populate({
        path: "appointmentId",
        populate: { path: "serviceId" },
      });

    // Lọc bỏ các ca làm việc không có employeeId (do không match với role == 2)
    const validShifts = shifts.filter((shift) => shift.employeeId);

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = date.date(day);
      const dateStr = currentDate.format("YYYY-MM-DD");
      const startOfDay = currentDate.startOf("day").toDate();

      // Lọc các ca làm việc không bị exclude trong ngày
      const dailyShifts = validShifts.filter(
        (shift) =>
          !shift.excludedDates?.some((excludedDate) =>
            dayjs(excludedDate).isSame(startOfDay, "day")
          )
      );

      const busySlotMap = {};

      for (const shift of dailyShifts) {
        const techName = shift.employeeId?.fullName || "Kỹ thuật viên";
        const shiftStart = new Date(
          `${dateStr}T${shift.startHour || "08:00"}:00`
        );
        const shiftEnd = new Date(`${dateStr}T${shift.endHour || "17:00"}:00`);

        for (const slot of slotList) {
          const slotTime = new Date(`${dateStr}T${slot}:00`);

          if (slotTime < shiftStart || slotTime >= shiftEnd) continue;

          const isBusy = (shift.appointmentId || []).some((appt) => {
            const bufferTime = 15;
            const apptStart = appt.appointmentTime;
            const duration =
              (appt.serviceId?.estimatedDuration || 60) + bufferTime;
            const apptEnd = new Date(apptStart.getTime() + duration * 60000);
            return slotTime >= apptStart && slotTime < apptEnd;
          });

          if (isBusy) {
            if (!busySlotMap[slot]) busySlotMap[slot] = [];
            busySlotMap[slot].push(techName);
          }
        }
      }

      // Tìm các khung giờ còn ít nhất 1 người rảnh
      const availableTimes = slotList.filter((slot) => {
        const busyCount = busySlotMap[slot]?.length || 0;
        return busyCount < dailyShifts.length;
      });

      // Tính toán trạng thái của ngày
      let status = "off";
      if (availableTimes.length > 0) {
        status =
          availableTimes.length <= 4
            ? "semi_busy"
            : availableTimes.length <= 7
            ? "light_busy"
            : "available";
      }

      // Đếm số lượng lịch hẹn trong ngày
      const appointmentCount = dailyShifts.reduce((count, shift) => {
        return (
          count +
          (shift.appointmentId || []).filter((appt) =>
            dayjs(appt.appointmentTime).isSame(currentDate, "day")
          ).length
        );
      }, 0);

      result[dateStr] = {
        status,
        availableTimesCount: availableTimes.length,
        appointmentCount,
        totalTechs: dailyShifts.length,
        slots: availableTimes,
        fullSlots: busySlotMap,
      };
    }

    return { days: result };
  },

  async getAnAvailableTime(employeeWorkScheduleId, dateStr) {
    console.log("Input ID:", employeeWorkScheduleId);
    console.log("Input date:", dateStr);

    const date = dayjs(dateStr);
    const startOfDay = date.startOf("day").toDate();

    // Debug: Kiểm tra tất cả documents
    const allShifts = await EmployeeWorkSchedule.find({});
    console.log("Total shifts:", allShifts.length);
    console.log(
      "All IDs:",
      allShifts.map((s) => s._id.toString())
    );

    // Debug: Kiểm tra document có tồn tại không
    const shiftExists = await EmployeeWorkSchedule.findById(
      employeeWorkScheduleId
    );
    console.log("Document exists:", !!shiftExists);
    if (shiftExists) {
      console.log("Status:", shiftExists.status);
      console.log("ExcludedDates:", shiftExists.excludedDates);
    }

    // Đơn giản hóa query như getAvailableTime
    const shift = await EmployeeWorkSchedule.findOne({
      _id: employeeWorkScheduleId,
      status: "Đang trực",
      excludedDates: { $nin: [startOfDay] },
    })
      .populate("employeeId")
      .populate({
        path: "appointmentId",
        populate: [{ path: "userId" }, { path: "serviceId" }],
      });

    if (!shift) {
      return {
        availableTimes: [],
        shift: null,
        message: "Nhân viên không có lịch trực trong ngày này",
      };
    }

    // Khung giờ làm việc mặc định mỗi ngày
    const slotList = [];
    for (let hour = 8; hour < 17; hour++) {
      slotList.push(`${hour.toString().padStart(2, "0")}:00`);
    }

    const busySlots = [];
    const shiftStart = new Date(`${dateStr}T${shift.startHour || "08:00"}:00`);
    const shiftEnd = new Date(`${dateStr}T${shift.endHour || "17:00"}:00`);

    for (const slot of slotList) {
      const slotTime = new Date(`${dateStr}T${slot}:00`);

      // Kiểm tra slot có trong ca làm việc không
      if (slotTime < shiftStart || slotTime >= shiftEnd) {
        continue;
      }

      // Kiểm tra slot có appointment không
      const isBusy = (shift.appointmentId || []).some((appt) => {
        const bufferTime = 15;
        const apptStart = appt.appointmentTime;
        const duration = (appt.serviceId?.estimatedDuration || 60) + bufferTime;
        const apptEnd = new Date(apptStart.getTime() + duration * 60000);
        return slotTime >= apptStart && slotTime < apptEnd;
      });

      if (isBusy) {
        busySlots.push(slot);
      }
    }

    // Lọc ra các slot rảnh
    const availableTimes = slotList.filter((slot) => {
      const slotTime = new Date(`${dateStr}T${slot}:00`);
      return (
        slotTime >= shiftStart &&
        slotTime < shiftEnd &&
        !busySlots.includes(slot)
      );
    });

    // Lấy tất cả lịch hẹn trong ngày
    const appointmentToday = (shift.appointmentId || []).filter((appt) => {
      const apptDate = dayjs(appt.appointmentTime).format("YYYY-MM-DD");
      return apptDate === dateStr;
    });

    return {
      availableTimes,
      shift,
      busySlots,
      appointmentToday,
    };
  },

  // Lấy thời gian khả dụng cho việc tư vấn
  /* 
    lưu ý: hàm đang đang gặp nhiều vấn đề và đăng ở bản thử nghiệm chưa được chạy
    cần sửa lại để phù hợp với yêu cầu
    cẩn sửa chữa lại logic cũng như cách tính toán thời gian khả dụng
    tương lai sẽ được sửa lại và cập nhật lại
   */
  async getAvailableConsultantTimes(employeeWorkScheduleId, dateStr) {
    const MAX_APPOINTMENTS_PER_SLOT = 5; // Tối đa 5 lịch hẹn cho mỗi slot 30 phút

    const date = dayjs(dateStr);
    const formattedDate = date.format("YYYY-MM-DD");
    const startOfDay = date.startOf("day").toDate();

    // Lấy ca làm việc
    const shift = await EmployeeWorkSchedule.findOne({
      _id: employeeWorkScheduleId,
      status: "Đang trực",
      excludedDates: { $nin: [startOfDay] },
    })
      .populate("employeeId")
      .populate({
        path: "appointmentId",
        populate: { path: "serviceId" },
      });

    if (!shift) {
      return {
        availableTimes: [],
        shift: null,
        busySlots: [],
        message: "Nhân viên không có lịch trực trong ngày này",
      };
    }

    // Tạo danh sách slot 30 phút trong ca làm việc
    const slotList = [];
    const shiftStartHour = parseInt((shift.startHour || "08:00").split(":")[0]);
    const shiftEndHour = parseInt((shift.endHour || "17:00").split(":")[0]);
    for (let hour = shiftStartHour; hour < shiftEndHour; hour++) {
      slotList.push(`${hour.toString().padStart(2, "0")}:00`);
      slotList.push(`${hour.toString().padStart(2, "0")}:30`);
    }

    // Tạo shiftStart, shiftEnd dạng local time
    const shiftStart = dayjs(
      `${dateStr}T${shift.startHour || "08:00"}`
    ).toDate();
    const shiftEnd = dayjs(`${dateStr}T${shift.endHour || "17:00"}`).toDate();

    // Đếm số lượng appointment trong từng slot 30 phút
    const slotCounts = {};
    if (shift.appointmentId && shift.appointmentId.length > 0) {
      for (const appt of shift.appointmentId) {
        if (!appt || !appt.appointmentTime) continue;
        const apptTime = dayjs(appt.appointmentTime);
        const apptDate = apptTime.format("YYYY-MM-DD");
        if (apptDate !== formattedDate) continue;
        const hours = apptTime.hour();
        const minutes = apptTime.minute();
        const slot = `${hours.toString().padStart(2, "0")}:${
          minutes < 30 ? "00" : "30"
        }`;
        slotCounts[slot] = (slotCounts[slot] || 0) + 1;
      }
    }

    // Xác định slot đã đầy (>= 5 đơn)
    const busySlots = Object.entries(slotCounts)
      .filter(([_, count]) => count >= MAX_APPOINTMENTS_PER_SLOT)
      .map(([slot]) => slot);

    // Lọc ra các slot còn trống, nằm trong ca làm việc và chưa đủ 5 đơn
    const availableTimes = slotList.filter((slot) => {
      const slotTime = dayjs(`${dateStr}T${slot}:00`).toDate();
      const count = slotCounts[slot] || 0;
      return (
        slotTime >= shiftStart &&
        slotTime < shiftEnd &&
        count < MAX_APPOINTMENTS_PER_SLOT
      );
    });

    return {
      availableTimes,
      shift,
      busySlots,
      slotCounts, // Thêm thông tin số lượng cuộc hẹn mỗi slot để dễ debug
    };
  },
};

export default availableTimeService;
