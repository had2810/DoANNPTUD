const adminService = require("./humanResources/adminService");
const userService = require("./humanResources/userService");
const employeesService = require("./humanResources/employeesService");

const authService = {
  // Tìm user theo email (ưu tiên admin, employee, user)
  findByEmail: async (email) => {
    // Ưu tiên tìm admin
    let user = await adminService.findByEmail?.(email);
    if (user) return { ...user.toObject(), role: "admin" };
    // Tìm employee
    user = await employeesService.findByEmail?.(email);
    if (user) return { ...user.toObject(), role: "employee" };
    // Tìm user thường
    user = await userService.findByEmail?.(email);
    if (user) return { ...user.toObject(), role: "user" };
    return null;
  },

  // Kiểm tra mật khẩu cho user đã tìm được (so sánh trực tiếp)
  checkPassword: async (user, password) => {
    if (!user || !user.password) throw new Error("User not found");
    const { comparePassword } = require("../utils/passwordHash");
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error("Invalid password");
    return user;
  },
};

module.exports = authService;
