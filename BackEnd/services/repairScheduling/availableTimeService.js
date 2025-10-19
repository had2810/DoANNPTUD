const dayjs = require("dayjs");
const Appointment = require("../../schemas/repairScheduling/appointments.model");
const EmployeeWorkSchedule = require("../../schemas/repairScheduling/employeeWork.model");
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const availableTimeService = {
  async getAvailableTimeByDate(dateStr) {
    const date = dayjs(dateStr);
    const startOfDay = date.startOf("day").toDate();
    const endOfDay = date.endOf("day").toDate();
    
    // Tính tuần của ngày được yêu cầu
    const weekStartDate = date.startOf('week').add(1, 'day').toDate(); // Thứ 2
    const weekEndDate = date.startOf('week').add(7, 'day').toDate(); // Chủ nhật

    console.log("Debug getAvailableTimeByDate:");
    console.log("- Requested date:", dateStr);
    console.log("- weekStartDate:", weekStartDate);
    console.log("- weekEndDate:", weekEndDate);

    // Lấy lịch làm việc của tuần chứa ngày đó (chỉ tuần chính xác)
    const shifts = await EmployeeWorkSchedule.find({
      status: "Đang trực",
      excludedDates: { $nin: [startOfDay] },
      weekStartDate: weekStartDate,
      weekEndDate: weekEndDate,
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

    console.log("Debug shifts:");
    console.log("- Total shifts found:", shifts.length);
    console.log("- Valid shifts:", validShifts.length);
    console.log("- Shifts data:", shifts.map(s => ({
      id: s._id,
      employeeId: s.employeeId,
      weekStartDate: s.weekStartDate,
      weekEndDate: s.weekEndDate,
      workDays: s.workDays
    })));

    // Khung giờ làm việc mặc định mỗi ngày
    const slotList = [];
    for (let hour = 8; hour < 17; hour++) {
      slotList.push(`${hour.toString().padStart(2, "0")}:00`);
    }

    const busySlotMap = {};

    for (const shift of validShifts) {
      const techName = shift.employeeId?.fullName || "Kỹ thuật viên";
      
      // Kiểm tra ngày có làm việc không
      const dayOfWeek = date.day() + 1; // Convert to 1-7 format (1=CN, 2=T2, ...)
      const workingDay = shift.workDays.find(w => w.dayOfWeek === dayOfWeek);
      
      if (!workingDay) continue; // Không làm việc ngày này
      
      const shiftStart = new Date(
        `${dateStr}T${workingDay.startHour || "08:00"}:00`
      );
      const shiftEnd = new Date(`${dateStr}T${workingDay.endHour || "17:00"}:00`);

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

    console.log("Debug final result:");
    console.log("- availableTimes:", availableTimes);
    console.log("- busySlotMap:", busySlotMap);
    console.log("- validShifts.length:", validShifts.length);

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
    const startOfMonth = date.startOf("month").toDate();
    const endOfMonth = date.endOf("month").toDate();
    
    const shifts = await EmployeeWorkSchedule.find({
      status: "Đang trực",
      weekStartDate: { $lte: endOfMonth },
      weekEndDate: { $gte: startOfMonth },
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

      // Lọc các ca làm việc không bị exclude trong ngày và có làm việc trong ngày đó
      const dailyShifts = validShifts.filter((shift) => {
        // Kiểm tra không bị exclude
        const isExcluded = shift.excludedDates?.some((excludedDate) =>
          dayjs(excludedDate).isSame(startOfDay, "day")
        );
        if (isExcluded) return false;

        // Kiểm tra ngày có nằm trong tuần làm việc không
        const dayOfWeek = currentDate.day() + 1; // Convert to 1-7 format
        const workingDay = shift.workDays.find(w => w.dayOfWeek === dayOfWeek);
        
        // Kiểm tra ngày có nằm trong tuần cụ thể không
        const isInWeek = dayjs(startOfDay).isSameOrAfter(dayjs(shift.weekStartDate)) && 
                        dayjs(startOfDay).isSameOrBefore(dayjs(shift.weekEndDate));
        
        return !!workingDay && isInWeek;
      });

      const busySlotMap = {};

      for (const shift of dailyShifts) {
        const techName = shift.employeeId?.fullName || "Kỹ thuật viên";
        const dayOfWeek = currentDate.day() + 1;
        const workingDay = shift.workDays.find(w => w.dayOfWeek === dayOfWeek);
        
        const shiftStart = new Date(
          `${dateStr}T${workingDay.startHour || "08:00"}:00`
        );
        const shiftEnd = new Date(`${dateStr}T${workingDay.endHour || "17:00"}:00`);

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

      // Chỉ thêm ngày vào kết quả nếu có nhân viên làm việc
      if (dailyShifts.length > 0) {
        result[dateStr] = {
          status,
          availableTimesCount: availableTimes.length,
          appointmentCount,
          totalTechs: dailyShifts.length,
          slots: availableTimes,
          fullSlots: busySlotMap,
        };
      }
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

    // Tính tuần của ngày được yêu cầu
    const weekStartDate = date.startOf('week').add(1, 'day').toDate(); // Thứ 2
    const weekEndDate = date.endOf('week').add(1, 'day').toDate(); // Chủ nhật

    // Tìm lịch làm việc của tuần chứa ngày đó (chỉ tuần chính xác)
    const shift = await EmployeeWorkSchedule.findOne({
      _id: employeeWorkScheduleId,
      status: "Đang trực",
      excludedDates: { $nin: [startOfDay] },
      weekStartDate: weekStartDate,
      weekEndDate: weekEndDate,
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

    // Kiểm tra ngày có làm việc không
    const dayOfWeek = date.day() + 1; // Convert to 1-7 format
    const workingDay = shift.workDays.find(w => w.dayOfWeek === dayOfWeek);
    
    if (!workingDay) {
      return {
        availableTimes: [],
        shift: null,
        message: "Nhân viên không làm việc ngày này",
      };
    }

    // Khung giờ làm việc mặc định mỗi ngày
    const slotList = [];
    for (let hour = 8; hour < 17; hour++) {
      slotList.push(`${hour.toString().padStart(2, "0")}:00`);
    }

    const busySlots = [];
    const shiftStart = new Date(`${dateStr}T${workingDay.startHour || "08:00"}:00`);
    const shiftEnd = new Date(`${dateStr}T${workingDay.endHour || "17:00"}:00`);

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

    // Tính tuần của ngày được yêu cầu
    const weekStartDate = date.startOf('week').add(1, 'day').toDate(); // Thứ 2
    const weekEndDate = date.endOf('week').add(1, 'day').toDate(); // Chủ nhật

    // Lấy ca làm việc
    const shift = await EmployeeWorkSchedule.findOne({
      _id: employeeWorkScheduleId,
      status: "Đang trực",
      excludedDates: { $nin: [startOfDay] },
      weekStartDate: { $lte: weekEndDate },
      weekEndDate: { $gte: weekStartDate },
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

    // Kiểm tra ngày có làm việc không
    const dayOfWeek = date.day() + 1; // Convert to 1-7 format
    const workingDay = shift.workDays.find(w => w.dayOfWeek === dayOfWeek);
    
    if (!workingDay) {
      return {
        availableTimes: [],
        shift: null,
        busySlots: [],
        message: "Nhân viên không làm việc ngày này",
      };
    }

    // Tạo danh sách slot 30 phút trong ca làm việc
    const slotList = [];
    const shiftStartHour = parseInt((workingDay.startHour || "08:00").split(":")[0]);
    const shiftEndHour = parseInt((workingDay.endHour || "17:00").split(":")[0]);
    for (let hour = shiftStartHour; hour < shiftEndHour; hour++) {
      slotList.push(`${hour.toString().padStart(2, "0")}:00`);
      slotList.push(`${hour.toString().padStart(2, "0")}:30`);
    }

    // Tạo shiftStart, shiftEnd dạng local time
    const shiftStart = dayjs(
      `${dateStr}T${workingDay.startHour || "08:00"}`
    ).toDate();
    const shiftEnd = dayjs(`${dateStr}T${workingDay.endHour || "17:00"}`).toDate();

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

module.exports = availableTimeService;
