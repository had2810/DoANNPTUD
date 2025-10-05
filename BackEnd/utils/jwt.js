import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Lấy secret từ biến môi trường (.env)
const secretKey = process.env.ACCESS_TOKEN_SECRET;
const refreshKey = process.env.REFRESH_TOKEN_SECRET;

/**
 * Tạo accessToken sống 20 giây
 * - Chứa thông tin người dùng như id, email, role,...
 * - Dùng để truy cập các API cần đăng nhập
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, secretKey, {
    expiresIn: "30m",
  });
};

/**
 * Tạo refreshToken sống 7 ngày
 * - Dùng để tạo lại accessToken khi hết hạn
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, refreshKey, {
    expiresIn: "7d",
  });
};

/**
 * Xác minh accessToken hợp lệ
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, secretKey);
};

/**
 * Xác minh refreshToken hợp lệ
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, refreshKey);
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
