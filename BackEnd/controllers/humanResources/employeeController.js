const employeesService = require("../../services/humanResources/employeesService");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const EmployeeController = {
  // ➕ Add Employee
  addEmployee: async (req, res) => {
    try {
      const employee = await employeesService.createEmployee(req.body);
      res.status(201).json(employee);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 🔑 Login Employee
  loginEmployee: async (req, res) => {
    try {
      const employee = await employeesService.checkPassword(
        req.body.email,
        req.body.password
      );

      // Tạo JWT token
      const token = jwt.sign(
        {
          id: employee._id,
          exp: Math.floor(Date.now() / 1000) + 15 * 60, // Hết hạn sau 15 phút
        },
        process.env.JWT_SECRET || "NNPTUD"
      );

      // Ghi token vào cookie
      res.cookie("token", `Bearer ${token}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      });

      res.status(200).json({
        message: "Login successful",
        employee: _.omit(employee.toObject(), ["password"]),
        token, // Trả về token trong response
      });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  },

  // ➖ Logout Employee
  logoutEmployee: async (req, res) => {
    try {
      res.cookie("token", "", { maxAge: 0 }); // Xóa cookie
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ message: "Logout failed", error: error.message });
    }
  },

  // 👤 Get Employee
  getEmployee: async (req, res) => {
    try {
      const employee = await employeesService.getById(req.params.id);
      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 📋 Get All Employees
  getAllEmployees: async (req, res) => {
    try {
      const employees = await employeesService.getAll();
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ✏️ Update Employee
  updateEmployee: async (req, res) => {
    try {
      const updateData = _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "address",
        "avatar_url",
        "status",
      ]);

      const employee = await employeesService.updateEmployee(
        req.params.id,
        updateData
      );
      res.status(200).json({ message: "Employee updated", employee });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ❌ Delete Employee
  deleteEmployee: async (req, res) => {
    try {
      await employeesService.deleteEmployee(req.params.id);
      res.status(200).json({ message: "Employee soft-deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 🔐 Change Password
  changePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      await employeesService.changePassword(
        req.params.id,
        oldPassword,
        newPassword
      );
      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = EmployeeController;
