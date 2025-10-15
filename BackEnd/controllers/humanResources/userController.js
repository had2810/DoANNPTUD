const userService = require("../../services/humanResources/userService");
const _ = require("lodash");

const userController = {
  // Lấy 1 user theo id
  getUser: async (req, res) => {
    try {
      const user = await userService.getById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Lấy tất cả user
  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Cập nhật user
  updateUser: async (req, res) => {
    try {
      const updateData = _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "address",
        "avatar_url",
      ]);

      const user = await userService.updateUser(req.params.id, updateData);
      res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Xóa user
  deleteUser: async (req, res) => {
    try {
      await userService.delete(req.params.id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Đổi mật khẩu
  changePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      await userService.changePassword(req.params.id, oldPassword, newPassword);
      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
