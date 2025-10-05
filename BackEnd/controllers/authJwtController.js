const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const Admin = require("../schemas/humanResources/admin.model");
const Employee = require("../schemas/humanResources/employees.model");
const User = require("../schemas/humanResources/user.model");

// =========================================
// [B1] Manual Login Controller (Test Only)
// Nhận dữ liệu người dùng từ Postman (email, role)
// → Tạo accessToken + refreshToken
// =========================================
const manualLoginController = (req, res) => {
  const { email, role } = req.body;

  // Kiểm tra nếu thiếu email hoặc role thì trả lỗi
  if (!email || !role) {
    return res.status(400).json({ message: "Missing email or role" });
  }

  // Tạo accessToken (sống 20s) chứa thông tin user
  const accessToken = generateAccessToken({ email, role });

  // Tạo refreshToken (sống 7 ngày) để làm mới accessToken sau này
  const refreshToken = generateRefreshToken({ email, role });

  // Trả về cả hai token cho client
  res.status(200).json({ accessToken, refreshToken });
};

// =========================================
// [B2] Refresh Access Token Controller
// Dùng refreshToken hợp lệ để tạo lại accessToken mới
// =========================================
const refreshTokenController = (req, res) => {
  // Middleware đã xác minh refreshToken và gán thông tin user vào req.user
  const user = req.user;

  // Tạo accessToken mới từ thông tin user trong refreshToken
  const newAccessToken = generateAccessToken({ id: user.id, role: user.role });

  // Trả về accessToken mới
  res.status(200).json({ accessToken: newAccessToken });
};

// =========================================
// [B3] Verify Token Controller
// Kiểm tra accessToken hoặc refreshToken còn hợp lệ không
// =========================================
const verifyTokenController = (req, res) => {
  // Nếu đến được đây tức là token hợp lệ (qua middleware)
  res.status(200).json({
    message: "Token is valid!",
    user: req.user, // Thông tin user đã được gắn từ middleware
  });
};

const getMeController = async (req, res) => {
  try {
    const { email } = req.user;

    // Tìm user trong tất cả các collection
    let user = await User.findOne({ email });
    if (user) {
      const { password, ...userWithoutPassword } = user.toObject();
      return res.status(200).json({
        message: "Get me successfully",
        data: { ...userWithoutPassword, role: "user" },
      });
    }

    user = await Admin.findOne({ email });
    if (user) {
      const { password, ...userWithoutPassword } = user.toObject();
      return res.status(200).json({
        message: "Get me successfully",
        data: { ...userWithoutPassword, role: "admin" },
      });
    }

    user = await Employee.findOne({ email });
    if (user) {
      const { password, ...userWithoutPassword } = user.toObject();
      return res.status(200).json({
        message: "Get me successfully",
        data: { ...userWithoutPassword, role: "employee" },
      });
    }

    return res.status(404).json({
      message: "User not found",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error getting user information",
      error: error.message,
    });
  }
};

// Export các controller ra ngoài cho router sử dụng
module.exports = {
  manualLoginController,
  refreshTokenController,
  verifyTokenController,
  getMeController,
};
