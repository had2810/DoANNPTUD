const express = require("express");
const { authenticate } = require("../utils/authHandler");
const authController = require("../controllers/authController");

const router = express.Router();

// Đăng ký tài khoản (type: user/admin/employee)
router.post("/register", authController.register);
// Đăng nhập tài khoản (type: user/admin/employee)
router.post("/login", authController.login);
// Đăng xuất tài khoản
router.post("/logout", authController.logout);
// Lấy thông tin tài khoản hiện tại (dùng cho mọi loại role)
router.get("/me", authenticate, authController.getMe);

module.exports = router;
