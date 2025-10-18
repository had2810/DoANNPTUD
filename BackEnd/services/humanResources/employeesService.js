const User = require("../../schemas/humanResources/user.model");
const baseService = require("../baseService");
const changePasswordService = require("../changePasswordService");
const EmployeeWorkSchedule = require("../../schemas/repairScheduling/employeeWork.model");
const Appointment = require("../../schemas/repairScheduling/appointments.model");
const mongoose = require("mongoose");

const base = baseService(User, { populateFields: ["role"] });

const employeesService = {
  ...base,

  // 🔍 Tìm nhân viên theo email (role = 2 hoặc 3)
  findByEmail: async (email) => {
    return await User.findOne({
      email,
      role: { $in: [2, 3] }, // ✅ chỉ tìm nhân viên
      isDeleted: { $ne: true },
    })
      .select("+password")
      .populate("role");
  },

  // 📋 Lấy tất cả nhân viên (role = 2 hoặc 3)
  getAll: async (filter = {}) => {
    const query = {
      ...filter,
      role: { $in: [2, 3] },
      isDeleted: { $ne: true },
    };
    return base.getAll(query);
  },

  getById: async (id) => {
    return await base.getById(id);
  },

  update: async (id, data) => {
    const employee = await base.getById(id);
    if (!employee || ![2, 3].includes(employee.role)) {
      throw new Error("Employee not found");
    }
    return base.update(id, data);
  },

  delete: async (id) => {
    const employee = await base.getById(id);
    if (!employee || ![2, 3].includes(employee.role)) {
      throw new Error("Employee not found");
    }
    return base.delete(id);
  },

  // ➕ Tạo nhân viên mới + khởi tạo lịch trực mặc định
  createEmployee: async (employeeData) => {
    try {
      // Nếu frontend gửi role thì dùng đúng role đó, nếu không thì mặc định là 2 (kỹ thuật viên)
      if (
        typeof employeeData.role === "undefined" ||
        employeeData.role === ""
      ) {
        employeeData.role = 2;
      }
      // Đảm bảo role là số nguyên
      employeeData.role = parseInt(employeeData.role);

      // Tự động sinh fullName nếu chưa có
      if (
        !employeeData.fullName &&
        (employeeData.firstName || employeeData.lastName)
      ) {
        employeeData.fullName = `${employeeData.firstName?.trim() || ""} ${
          employeeData.lastName?.trim() || ""
        }`.trim();
      }

      const employee = await base.create(employeeData);

      // Tạo lịch trực mặc định
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
      if (newData.firstName || newData.lastName) {
        newData.fullName = `${newData.firstName?.trim() || ""} ${
          newData.lastName?.trim() || ""
        }`.trim();
      }
      // Nếu có trường role thì chuyển thành số nguyên
      if (typeof newData.role !== "undefined" && newData.role !== "") {
        newData.role = parseInt(newData.role);
      }
      return await base.update(id, newData);
    } catch (error) {
      throw new Error(`Failed to update employee: ${error.message}`);
    }
  },

  // ❌ Xóa nhân viên (soft/hard)
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

  changePassword: async (id, oldPassword, newPassword) => {
    try {
      const result = await changePasswordService(User).changePassword(
        id,
        oldPassword,
        newPassword
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to change password: ${error.message}`);
    }
  },
};

module.exports = employeesService;
