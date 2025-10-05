const Employees = require("../../schemas/humanResources/employees.model");
const baseService = require("../baseService");
const EmployeeWorkSchedule = require("../../schemas/repairScheduling/employeeWork.model");
const Appointment = require("../../schemas/repairScheduling/appointments.model");
const { hashPassword } = require("../../utils/passwordHash");
const mongoose = require("mongoose");

// Gọi baseService 1 lần với populateFields (nếu Employees có field 'role')
const base = baseService(Employees, { populateFields: ["role"] });

const employeesService = {
  ...base,

  createEmployee: async (employeeData) => {
    employeeData.password = await hashPassword(employeeData.password);
    const employee = await base.create(employeeData);
    await EmployeeWorkSchedule.create({
      employeeId: employee._id,
      startTime: new Date(),
      endTime: new Date(),
      startHour: "08:00",
      endHour: "17:00",
      status: "Đang trực",
      note: "Chào mừng bạn đã đến với công ty",
    });

    return employee;
  },

  updateEmployee: async (id, newData) => {
    if (newData.firstName && newData.lastName) {
      newData.fullName =
        newData.firstName.trim() + " " + newData.lastName.trim();
    }
    if (newData.password) {
      newData.password = await hashPassword(newData.password);
    }
    return await base.update(id, newData);
  },

  changePassword: async (id, oldPassword, newPassword) => {
    return await changePasswordService(Employees).changePassword(
      id,
      oldPassword,
      newPassword
    );
  },

  deleteEmployee: async (id) => {
    const objectId = new mongoose.Types.ObjectId(id);
    console.log("🔄 XÓA NHÂN VIÊN:", id);
    console.log("👉 ObjectId ép kiểu:", objectId);

    const relatedSchedules = await EmployeeWorkSchedule.find({
      employeeId: objectId,
    });
    const relatedAppointments = await Appointment.find({
      employeeId: objectId,
    });

    console.log(`📋 Schedule tìm được: ${relatedSchedules.length}`);
    console.log(`📋 Appointment tìm được: ${relatedAppointments.length}`);

    const scheduleDeleteResult = await EmployeeWorkSchedule.deleteMany({
      employeeId: objectId,
    });
    const appointmentUpdateResult = await Appointment.updateMany(
      { employeeId: objectId },
      { $unset: { employeeId: "" } }
    );

    const employeeDeleteResult = await base.delete(id); // Không truyền session

    console.log(`✅ Đã xóa ${scheduleDeleteResult.deletedCount} schedule`);
    console.log(
      `✅ Đã gỡ liên kết khỏi ${appointmentUpdateResult.modifiedCount} appointments`
    );
    console.log(`✅ Nhân viên đã xóa:`, employeeDeleteResult);

    return { success: true };
  },
};

module.exports = employeesService;
