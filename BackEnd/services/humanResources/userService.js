const User = require("../../schemas/humanResources/user.model");
const baseService = require("../baseService");
const { comparePassword } = require("../../utils/passwordHash");
const changePasswordService = require("../changePasswordService");
const { sendMail } = require("../emailService");

const base = baseService(User, { populateFields: ["role"] });

const userService = {
  ...base,
  
  // Override base methods to filter by role = 4 (User)
  getAll: async (filter = {}) => {
    return base.getAll({ ...filter, role: 4 });
  },
  
  getById: async (id) => {
    const user = await base.getById(id);
    if (user && user.role !== 4) {
      throw new Error("User not found");
    }
    return user;
  },
  
  update: async (id, data) => {
    const user = await base.getById(id);
    if (user && user.role !== 4) {
      throw new Error("User not found");
    }
    return base.update(id, data);
  },
  
  delete: async (id) => {
    const user = await base.getById(id);
    if (user && user.role !== 4) {
      throw new Error("User not found");
    }
    return base.delete(id);
  },

  // 🧩 Tạo người dùng mới + gửi mail chào mừng
  createUser: async (userData) => {
    try {
      userData.fullName = `${userData.firstName?.trim() || ""} ${
        userData.lastName?.trim() || ""
      }`.trim();
      userData.role = 4; // Set role to User
      // Không cần hashPassword, middleware pre("save") sẽ xử lý
      const newUser = await base.create(userData);

      // Comment hoặc xóa phần gửi mail để test
      /*
      try {
        if (userData.email) {
          await sendMail(userData.email, "registration", userData.fullName);
        }
      } catch (err) {
        console.warn("⚠️ Gửi mail thất bại:", err.message);
      }
      */

      return newUser;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  },

  // 🧩 Kiểm tra đăng nhập
  checkPassword: async (email, password) => {
    try {
      const user = await User.findOne({
        email,
        role: 4, // User role
        isDeleted: { $ne: true },
      }).select("+password");
      if (!user) {
        throw new Error("User not found");
      }
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid password");
      }
      return user;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  },

  // ✏️ Cập nhật user
  updateUser: async (id, newData) => {
    try {
      if (newData.firstName && newData.lastName) {
        newData.fullName = `${newData.firstName.trim()} ${newData.lastName.trim()}`;
      }
      // Không cần hashPassword, middleware pre("save") sẽ xử lý
      return await base.update(id, newData);
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
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

module.exports = userService;
