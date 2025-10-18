const adminService = require("../../services/humanResources/adminService");
const _ = require("lodash");

const adminController = {
  // Lấy tất cả admin
  getAllAdmins: async (req, res) => {
    try {
      const admins = await adminService.getAll();
      res.status(200).json(admins);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Lấy 1 admin theo id
  getAdmin: async (req, res) => {
    try {
      const admin = await adminService.getById(req.params.id);
      res.status(200).json(admin);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Cập nhật admin
  updateAdmin: async (req, res) => {
    try {
      const updateData = _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "avatar_url",
        "address",
      ]);

      const admin = await adminService.updateAdmin(req.params.id, updateData);
      res.status(200).json({ message: "Admin updated successfully", admin });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Xóa admin (soft delete)
  deleteAdmin: async (req, res) => {
    try {
      await adminService.delete(req.params.id);
      res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Đổi mật khẩu
  // Đổi mật khẩu
  changePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Missing passwords" });
      }

      const result = await adminService.changePassword(
        req.user.id, // ✅ Dùng id trong token thay vì req.params.id
        oldPassword,
        newPassword
      );

      res.status(200).json(result);
    } catch (error) {
      console.error("[CHANGE PASSWORD ERROR]", error); // ✅ để debug dễ hơn
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = adminController;
