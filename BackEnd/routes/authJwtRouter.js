const express = require("express");
const {
  manualLoginController,
  refreshTokenController,
  verifyTokenController,
  getMeController,
} = require("../controllers/authJwtController");

const {
  checkAccessToken,
  checkRefreshToken,
} = require("../middleware/authJwtMiddleware");

const router = express.Router();

/**
 * [B1] Tạo accessToken & refreshToken từ dữ liệu giả (gửi từ Postman)
 * - Dùng để test JWT (chưa kết nối DB thật)
 * - Body: { email, role }
 */
router.post("/manual-login", manualLoginController);

/**
 * [B2] Kiểm tra accessToken còn hạn không
 * - Middleware sẽ xác thực accessToken
 * - Controller sẽ trả "Token is valid" nếu đúng
 */
router.post("/verify-accessToken", checkAccessToken, verifyTokenController);

/**
 * [B3] Tạo accessToken mới từ refreshToken
 * - Dùng khi accessToken hết hạn
 * - Middleware xác thực refreshToken
 */
router.post("/sign-accessToken", checkRefreshToken, refreshTokenController);

/**
 * [B4] Kiểm tra refreshToken còn sống không
 */
router.post("/verify-refreshToken", checkRefreshToken, verifyTokenController);

/**
 * [B5] Lấy thông tin người dùng hiện tại
 * - Middleware sẽ xác thực accessToken
 * - Controller sẽ trả về thông tin người dùng
 */
router.get("/me", checkAccessToken, getMeController);

module.exports = router;
