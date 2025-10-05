const Admin = require("../../schemas/humanResources/admin.model");
const baseService = require("../baseService");
const { hashPassword, comparePassword } = require("../../utils/passwordHash");
const changePasswordService = require("../changePasswordService");

// Gọi baseService 1 lần với populateFields (nếu Admin có field 'role')
const base = baseService(Admin, { populateFields: ["role"] });

const adminService = {
  ...base,

  createAdmin: async (adminData) => {
    adminData.fullName =
      adminData.firstName.trim() + " " + adminData.lastName.trim();
    adminData.password = await hashPassword(adminData.password);
    return await base.create(adminData);
  },

  updateAdmin: async (id, newData) => {
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
    return await changePasswordService(Admin).changePassword(
      id,
      oldPassword,
      newPassword
    );
  },
};

module.exports = adminService;
