const User = require("../../schemas/humanResources/user.model");
const baseService = require("../baseService");
const changePasswordService = require("../changePasswordService");
const EmployeeWorkSchedule = require("../../schemas/repairScheduling/employeeWork.model");
const Appointment = require("../../schemas/repairScheduling/appointments.model");
const { comparePassword } = require("../../utils/passwordHash");
const mongoose = require("mongoose");

const base = baseService(User, { populateFields: ["role"] });

const employeesService = {
  ...base,

  // Tìm employee theo email
  findByEmail: async (email) => {
    return await User.findOne({
      email,
      role: 2,
      isDeleted: { $ne: true },
    }).select("+password");
  },

  // Override base methods to filter by role = 2 (Employee)
  getAll: async (filter = {}) => {
    return base.getAll({ ...filter, role: 2 });
  },

  getById: async (id) => {
    return await base.getById(id);
  },

  update: async (id, data) => {
    const employee = await base.getById(id);
    if (employee && employee.role !== 2) {
      throw new Error("Employee not found");
    }
    return base.update(id, data);
  },

  delete: async (id) => {
    const employee = await base.getById(id);
    if (employee && employee.role !== 2) {
      throw new Error("Employee not found");
    }
    return base.delete(id);
  },

  // ➕ Tạo nhân viên mới + khởi tạo lịch trực mặc định
  createEmployee: async (employeeData) => {
    try {
      employeeData.role = 2; // Set role to Employee
      // Không cần hashPassword, middleware pre("save") sẽ xử lý
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
    } catch (error) {
      throw new Error(`Failed to create employee: ${error.message}`);
    }
  },

  // ✏️ Cập nhật nhân viên
  updateEmployee: async (id, newData) => {
    try {
      if (newData.firstName && newData.lastName) {
        newData.fullName = `${newData.firstName.trim()} ${newData.lastName.trim()}`;
      }
      // Không cần hashPassword, middleware pre("save") sẽ xử lý
      return await base.update(id, newData);
    } catch (error) {
      throw new Error(`Failed to update employee: ${error.message}`);
    }
  },

  // ❌ Xóa nhân viên + xử lý dữ liệu liên quan
  deleteEmployee: async (id, opts = {}) => {
    try {
      const { hard = false } = opts;
      const objectId = new mongoose.Types.ObjectId(id);

      await EmployeeWorkSchedule.updateMany(
        { employeeId: objectId },
        { isDeleted: true }
      );
      await Appointment.updateMany(
        { employeeId: objectId },
        { $unset: { employeeId: "" } }
      );

      if (hard) return await base.hardDelete(id);
      return await base.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete employee: ${error.message}`);
    }
  },

  // 🔐 Đổi mật khẩu
  changePassword: async (id, oldPassword, newPassword) => {
    try {
      return await changePasswordService(User).changePassword(
        id,
        oldPassword,
        newPassword
      );
    } catch (error) {
      throw new Error(`Failed to change password: ${error.message}`);
    }
  },
};

module.exports = employeesService;
