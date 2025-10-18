const employeesService = require("../../services/humanResources/employeesService");
const _ = require("lodash");

const EmployeeController = {
  // Lấy 1 employee theo id
  getEmployee: async (req, res) => {
    try {
      const employee = await employeesService.getById(req.params.id);
      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Lấy tất cả employee
  getAllEmployees: async (req, res) => {
    try {
      const employees = await employeesService.getAll();
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Cập nhật employee
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
        "role", // Cho phép cập nhật role
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

  // Xóa employee
  deleteEmployee: async (req, res) => {
    try {
      await employeesService.deleteEmployee(req.params.id);
      res.status(200).json({ message: "Employee soft-deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Đổi mật khẩu
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
