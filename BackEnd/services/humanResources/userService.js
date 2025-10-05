const User = require("../../schemas/humanResources/user.model");
const baseService = require("../baseService");
const { hashPassword } = require("../../utils/passwordHash");
const changePasswordService = require("../changePasswordService");
const { sendMail } = require("../emailService");

// Gọi baseService 1 lần với populateFields (nếu User có field 'role')
const base = baseService(User, { populateFields: ["role"] });

const userService = {
  ...base,

  createUser: async (userData) => {
    userData.fullName =
      userData.firstName.trim() + " " + userData.lastName.trim();
    userData.password = await hashPassword(userData.password);
    const newUser = await base.create(userData);

    // Gửi email chào mừng khi đăng ký thành công
    try {
      if (userData.email) {
        await sendMail(userData.email, "registration", userData.fullName);
      }
    } catch (error) {
      console.error("Lỗi gửi email chào mừng:", error);
    }

    return newUser;
  },

  updateUser: async (id, newData) => {
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
    return await changePasswordService(User).changePassword(
      id,
      oldPassword,
      newPassword
    );
  },
};

module.exports = userService;
