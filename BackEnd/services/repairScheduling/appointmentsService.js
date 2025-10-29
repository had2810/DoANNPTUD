const mongoose = require("mongoose");
const baseService = require("../baseService");
const Appointment = require("../../schemas/repairScheduling/appointments.model");
const repairStatusService = require("./repairStatusService");
const Service = require("../../schemas/deviceService/service.model");
const EmployeeWork = require("../../schemas/repairScheduling/employeeWork.model");
const availableTimeService = require("./availableTimeService");
const dayjs = require("dayjs");
const User = require("../../schemas/humanResources/user.model");
const { sendMail } = require("../emailService");

const base = baseService(Appointment, {
  populateFields: ["userId", "deviceTemplateId", "serviceId", "employeeId"],
});

const appointmentsService = {
  ...base,
  async checkEmployeeAvailability(
    employeeId,
    appointmentTime,
    appointmentId = null
  ) {
    if (!employeeId || !appointmentTime) return false;

    // Kiểm tra xem nhân viên có role là 2 không
    const employee = await User.findById(employeeId);
    if (!employee) {
      throw new Error("Không tìm thấy thông tin nhân viên");
    }

    if (employee.role !== 2) {
      // Nếu không phải nhân viên role 2, không cần kiểm tra trùng lịch
      return true;
    }

    // Convert appointmentTime to a Date object if it's a string
    const appointmentDate = new Date(appointmentTime);

    // Format date for availability check
    const dateStr = dayjs(appointmentDate).format("YYYY-MM-DD");
    const timeHour = dayjs(appointmentDate).format("HH:00"); // Round to hour for slot check

    // Find employee work schedule
    const employeeWorkSchedule = await EmployeeWork.findOne({ employeeId });
    if (!employeeWorkSchedule) {
      throw new Error(
        `Nhân viên ${employee.fullName} chưa có lịch làm việc được thiết lập`
      );
    }

    // Get available times for this employee on this date
    const { availableTimes, busySlots } =
      await availableTimeService.getAnAvailableTime(
        employeeWorkSchedule._id,
        dateStr
      );

    console.log("Requested time:", timeHour);
    console.log("Available times:", availableTimes);

    // If this is an update to an existing appointment, we need to exclude it from the busy checks
    if (appointmentId) {
      // Get the current appointment to check if it's the same time
      const currentAppointment = await Appointment.findById(appointmentId);
      if (currentAppointment) {
        const sameTime =
          dayjs(currentAppointment.appointmentTime).format("HH:00") ===
          timeHour;
        const sameEmployee =
          currentAppointment.employeeId?.toString() === employeeId.toString();

        // If updating the same appointment to the same time slot with the same employee,
        // we should allow it even if that time is "busy" (because it's busy with THIS appointment)
        if (sameTime && sameEmployee) {
          return true;
        }
      }
    }

    // Check if the requested time hour is in the available times list
    if (!availableTimes.includes(timeHour)) {
      const formattedDate = dayjs(appointmentDate).format("DD/MM/YYYY");
      throw new Error(
        `Nhân viên ${employee.fullName} không có lịch trực vào lúc ${timeHour} ngày ${formattedDate}. ` +
          `Các khung giờ có sẵn: ${availableTimes.join(", ")}`
      );
    }

    return true;
  },

  async updateAppointmentAutoRepairStatus(id, data) {
    // If updating employee and appointment time, check availability first
    if (data.employeeId) {
      try {
        // If appointment time is being updated
        if (data.appointmentTime) {
          await this.checkEmployeeAvailability(
            data.employeeId,
            data.appointmentTime,
            id
          );
        } else {
          // If appointment time is not changing, still check availability with the existing time
          const existingAppointment = await Appointment.findById(id);
          if (existingAppointment && existingAppointment.appointmentTime) {
            await this.checkEmployeeAvailability(
              data.employeeId,
              existingAppointment.appointmentTime,
              id
            );
          }
        }
      } catch (error) {
        throw new Error(`Không thể cập nhật lịch hẹn: ${error.message}`);
      }
    }

    const previousAppointment = await Appointment.findById(id);
    const update = await base.update(id, data);

    // Gửi email khi đơn hàng được xác nhận hoặc hủy
    try {
      const populatedAppointment = await Appointment.findById(id)
        .populate("userId")
        .populate("deviceTemplateId")
        .populate("serviceId");

      if (populatedAppointment.userId?.email) {
        if (data.status === "confirmed") {
          await sendMail(
            populatedAppointment.userId.email,
            "orderConfirmed",
            populatedAppointment.userId.fullName,
            populatedAppointment.orderCode
          );
        } else if (data.status === "cancelled") {
          await sendMail(
            populatedAppointment.userId.email,
            "orderCancelled",
            populatedAppointment.userId.fullName,
            populatedAppointment.orderCode
          );
        }
      }
    } catch (error) {
      console.error("Lỗi gửi email:", error);
    }

    if (update && data.status === "confirmed") {
      const existed = await repairStatusService.getOne({
        appointmentId: update._id,
      });

      if (!existed) {
        const service = await Service.findById(update.serviceId);
        let estimatedMinutes = service?.estimatedDuration || 0;
        estimatedMinutes += 15;

        const now = new Date();
        const estimatedCompletionTime = new Date(
          now.getTime() + estimatedMinutes * 60000
        );

        await repairStatusService.create({
          appointmentId: update._id,
          status: "Checking",
          statusLog: [{ status: "Checking", time: now }],
          estimatedCompletionTime,
        });
      }

        // Tạo hóa đơn cho appointment nếu chưa có
        const Invoice = require("../../schemas/invoicePayments/invoice.model");
        const invoiceExisted = await Invoice.findOne({ appointmentId: update._id });
        if (!invoiceExisted) {
          const service = await Service.findById(update.serviceId);
      await Invoice.create({
  userId: new mongoose.Types.ObjectId(update.userId),
  appointmentId: new mongoose.Types.ObjectId(update._id),
  totalAmount: service?.price || 0,
  status: "Pending",
});

        }
    }
    // ✅ Nếu đổi nhân viên: cập nhật lại employeeWork
    const oldEmployeeId = previousAppointment.employeeId?.toString();
    const newEmployeeId = update.employeeId?.toString();

    console.log(
      "oldEmployeeId:",
      oldEmployeeId,
      "newEmployeeId:",
      newEmployeeId
    );

    if (oldEmployeeId && newEmployeeId && oldEmployeeId !== newEmployeeId) {
      // ❌ Gỡ khỏi employeeWork của nhân viên cũ
      const removeResult = await EmployeeWork.updateOne(
        { employeeId: oldEmployeeId },
        { $pull: { appointmentId: update._id } }
      );
      console.log("Remove from old employeeWork result:", removeResult);
    }
    // ✅ Luôn thêm vào employeeWork của nhân viên mới (kể cả khi phân công lần đầu)
    if (newEmployeeId) {
      const addResult = await EmployeeWork.updateOne(
        { employeeId: newEmployeeId },
        { $addToSet: { appointmentId: update._id } }
      );
      console.log("Add to new employeeWork result:", addResult);
    }
    return update;
  },

  async createAppointment(data) {
    // Check employee availability before creating appointment
    if (data.employeeId && data.appointmentTime) {
      try {
        await this.checkEmployeeAvailability(
          data.employeeId,
          data.appointmentTime
        );
      } catch (error) {
        throw new Error(`Không thể tạo lịch hẹn: ${error.message}`);
      }
    }

    // If no employee is assigned yet or employee is available, proceed with creation
    const newAppointment = await base.create(data);

    // Gửi email xác nhận tạo đơn hàng
    try {
      const populatedAppointment = await Appointment.findById(
        newAppointment._id
      )
        .populate("userId")
        .populate("deviceTemplateId")
        .populate("serviceId");

      if (populatedAppointment.userId?.email) {
        await sendMail(
          populatedAppointment.userId.email,
          "scheduleRepair",
          populatedAppointment.userId.fullName,
          dayjs(populatedAppointment.appointmentTime).format("DD/MM/YYYY HH:mm")
        );
      }
    } catch (error) {
      console.error("Lỗi gửi email:", error);
    }

    return newAppointment;
  },

  async lookupAppointment({ phoneNumber, orderCode }) {
    const appointment = await Appointment.findOne({ orderCode })
      .populate("userId")
      .populate("deviceTemplateId")
      .populate("serviceId")
      .populate("employeeId");

    if (!appointment || appointment.userId?.phoneNumber !== phoneNumber) {
      return null;
    }

    // Tìm trạng thái sửa chữa liên quan
    const repairStatus = await repairStatusService.getOne({
      appointmentId: appointment._id,
    });

    return {
      appointment,
      repairStatus,
    };
  },
  // 🧠 Đếm tổng số lượng (dùng cho phân trang)
  async countDocuments(filter = {}) {
    return await Appointment.countDocuments(filter);
  },
  // ✅ KHÔNG dùng async để giữ nguyên Query (sửa lỗi .skip)
  findMany(filter = {}) {
    return Appointment.find(filter).populate([
      { path: "userId", select: "-password -refreshToken" },
      { path: "deviceTemplateId" },
      { path: "serviceId" },
      { path: "employeeId" },
    ]);
  },

  async delete(id) {
    // Xóa appointment khỏi tất cả employeeworkschedules
    await EmployeeWork.updateMany({}, { $pull: { appointmentId: id } });
    // Xóa các bản ghi repairStatus liên quan
    await repairStatusService.deleteMany({ appointmentId: id });
    // Xóa appointment
    return base.delete(id);
  },
};

module.exports = appointmentsService;
