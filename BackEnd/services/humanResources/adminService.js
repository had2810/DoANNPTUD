const User = require("../../schemas/humanResources/user.model");
const baseService = require("../baseService");
const { comparePassword } = require("../../utils/passwordHash");
const changePasswordService = require("../changePasswordService");

const base = baseService(User, { populateFields: ["role"] });

const adminService = {
  ...base,

  // Tìm admin theo email
  findByEmail: async (email) => {
    return await User.findOne({
      email,
      role: 1,
      isDeleted: { $ne: true },
    }).select("+password");
  },

  // Override base methods to filter by role = 1 (Admin)
  getAll: async (filter = {}) => {
    return base.getAll({ ...filter, role: 1 });
  },

  getById: async (id) => {
    return await base.getById(id);
  },


  update: async (id, data) => {
    const admin = await base.getById(id);
    if (admin && admin.role != 1) {
      throw new Error("Admin not found");
    }
    return base.update(id, data);
  },

  delete: async (id) => {
    const admin = await base.getById(id);
    if (admin && admin.role != 1) {
      throw new Error("Admin not found");
    }
    return base.delete(id);
  },

  // 🧠 Đăng ký admin mới
  createAdmin: async (adminData) => {
    try {
      adminData.fullName = `${adminData.firstName?.trim() || ""} ${
        adminData.lastName?.trim() || ""
      }`.trim();
      adminData.role = 1; // Set role to Admin
      // Không cần hashPassword, middleware pre("save") sẽ xử lý
      return await base.create(adminData);
    } catch (error) {
      throw new Error(`Failed to create admin: ${error.message}`);
    }
  },

  // ✏️ Cập nhật thông tin admin
  updateAdmin: async (id, newData) => {
    try {
      if (newData.firstName && newData.lastName) {
        newData.fullName = `${newData.firstName.trim()} ${newData.lastName.trim()}`;
      }
      // Không cần hashPassword, middleware pre("save") sẽ xử lý
      return await base.update(id, newData);
    } catch (error) {
      throw new Error(`Failed to update admin: ${error.message}`);
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

module.exports = adminService;
