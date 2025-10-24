const express = require("express");
const { authenticate, authorize } = require("../utils/authHandler");
const authController = require("../controllers/authController");

const router = express.Router();

// Đăng ký tài khoản (type: user/admin/employee)
router.post("/register", authController.register);
// Đăng nhập tài khoản (type: user/admin/employee)
router.post("/login", authController.login);
// Đăng nhập Google
router.post("/loginGoogle", authController.loginGoogle);
// Đăng xuất tài khoản
router.post("/logout", authController.logout);
// Lấy thông tin tài khoản hiện tại (dùng cho mọi loại role)
const User = require("../schemas/humanResources/user.model");
router.get("/me", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Chưa đăng nhập" });
    }
    const user = await User.findById(req.user.id)
      // Lấy toàn bộ trường user, không select
      .populate({ path: "role" });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy user" });
    }
    console.log("[AUTH] /me response:", user);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;