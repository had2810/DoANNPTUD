const adminService = require("../../services/humanResources/adminService");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const adminController = {
  // ➕ Register Admin
  registerAdmin: async (req, res) => {
    try {
      const admin = await adminService.createAdmin(req.body);
      res.status(201).json(admin);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 🔑 Login Admin
  loginAdmin: async (req, res) => {
    try {
      const admin = await adminService.checkPassword(
        req.body.email,
        req.body.password
      );

      // Tạo JWT token
      const token = jwt.sign(
        {
          id: admin._id,
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
        admin: _.omit(admin.toObject(), ["password"]),
        token, // Trả về token trong response
      });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  },

  // ➖ Logout Admin
  logoutAdmin: async (req, res) => {
    try {
      res.cookie("token", "", { maxAge: 0 }); // Xóa cookie
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ message: "Logout failed", error: error.message });
    }
  },

  // 📋 Get All Admins
  getAllAdmins: async (req, res) => {
    try {
      const admins = await adminService.getAll();
      res.status(200).json(admins);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 👤 Get One Admin
  getAdmin: async (req, res) => {
    try {
      const admin = await adminService.getById(req.params.id);
      res.status(200).json(admin);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ✏️ Update Admin
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

  // ❌ Delete Admin (soft delete)
  deleteAdmin: async (req, res) => {
    try {
      await adminService.delete(req.params.id);
      res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 🔐 Change Password
  changePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Missing passwords" });
      }

      await adminService.changePassword(
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

module.exports = adminController;
