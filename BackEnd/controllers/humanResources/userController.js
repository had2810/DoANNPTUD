const userService = require("../../services/humanResources/userService");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const userController = {
  // ➕ Register
  registerUser: async (req, res) => {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 🔑 Login
  loginUser: async (req, res) => {
    try {
      const user = await userService.checkPassword(
        req.body.email,
        req.body.password
      );

      // Tạo JWT token
      const token = jwt.sign(
        {
          id: user._id,
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
        user: _.omit(user.toObject(), ["password"]),
        token, // Trả về token trong response giống router
      });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  },

  // ➖ Logout (thêm để tương thích với router)
  logoutUser: async (req, res) => {
    try {
      res.cookie("token", "", { maxAge: 0 }); // Xóa cookie
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ message: "Logout failed", error: error.message });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await userService.getById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

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

  deleteUser: async (req, res) => {
    try {
      await userService.delete(req.params.id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

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
