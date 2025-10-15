const userService = require("../services/humanResources/userService");
const adminService = require("../services/humanResources/adminService");
const employeeService = require("../services/humanResources/employeesService");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { Response } = require("../utils/responseHandler");

const authController = {
  // Đăng ký tài khoản
  register: async (req, res) => {
    try {
      console.log("[AUTH/REGISTER] req.body:", req.body);
      const { type, ...data } = req.body;
      let result;
      if (type === "admin") {
        result = await adminService.createAdmin(data);
      } else if (type === "employee") {
        result = await employeeService.createEmployee(data);
      } else {
        result = await userService.createUser(data);
      }
      console.log("[AUTH/REGISTER] result:", result);
      Response(res, 201, true, { message: "Đăng ký thành công", data: result });
    } catch (error) {
      console.error("[AUTH/REGISTER] error:", error);
      Response(res, 500, false, { message: error.message });
    }
  },

  // Đăng nhập tài khoản
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      // Tìm user theo email (ưu tiên admin, employee, user)
      let user = await adminService.findByEmail(email);
      if (!user) user = await employeeService.findByEmail(email);
      if (!user) user = await userService.findByEmail(email);
      if (!user) throw new Error("User not found");
      // Kiểm tra password
      const isMatch = await require("../utils/passwordHash").comparePassword(
        password,
        user.password
      );
      if (!isMatch) throw new Error("Invalid password");
      const token = jwt.sign(
        {
          id: user._id,
          exp: Math.floor(Date.now() / 1000) + 15 * 60,
        },
        process.env.JWT_SECRET || "NNPTUD"
      );
      res.cookie("token", `Bearer ${token}`, {
        httpOnly: true,
        secure: false, // Để false khi dev local, true khi production (https)
        sameSite: "lax", // Để "lax" khi dev local, "strict" khi production
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      let obj = user;
      if (typeof user.toObject === "function") obj = user.toObject();
      if (obj.password) delete obj.password;
      Response(res, 200, true, { message: "Đăng nhập thành công", data: obj });
    } catch (error) {
      Response(res, 401, false, { message: error.message });
    }
  },

  // Đăng xuất tài khoản
  logout: async (req, res) => {
    try {
      res.cookie("token", "", { maxAge: 0 }); // Xóa cookie
      Response(res, 200, true, { message: "Logout successful" });
    } catch (error) {
      Response(res, 500, false, {
        message: "Logout failed",
        error: error.message,
      });
    }
  },
  // Lấy thông tin user hiện tại từ token (cookie)
  getMe: async (req, res) => {
    try {
      console.log("[AUTH/ME] req.user:", req.user);
      if (!req.user) {
        return Response(res, 401, false, { message: "Chưa đăng nhập" });
      }
      let data = null;
      if (req.user.role === 1) {
        // Admin
        data = await adminService.getById(req.user.id);
      } else if (req.user.role === 2) {
        // Employee
        data = await employeeService.getById(req.user.id);
      } else {
        // User
        data = await userService.getById(req.user.id);
      }
      console.log("[AUTH/ME] data:", data);
      if (!data) {
        return res
          .status(404)
          .json({ status: 404, message: "Không tìm thấy user" });
      }
      res
        .status(200)
        .json({ status: 200, message: "Lấy thông tin thành công", data });
    } catch (error) {
      console.error("[AUTH/ME] ERROR:", error);
      res
        .status(500)
        .json({ status: 500, message: error.message, stack: error.stack });
    }
  },
};

module.exports = authController;
