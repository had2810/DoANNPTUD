const userService = require("../services/humanResources/userService");
const adminService = require("../services/humanResources/adminService");
const employeeService = require("../services/humanResources/employeesService");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { Response } = require("../utils/responseHandler");

const authController = {
  // Đăng ký tài khoản
  register: async (req, res) => {
    try {
      console.log("[AUTH/REGISTER] req.body:", req.body);
      const { type, ...data } = req.body;
      let result;
      if (type === "admin") {
        result = await adminService.createAdmin(data);
      } else if (type === "employee" || type === "consultant") {
        // Nếu là consultant thì truyền role = 3
        if (type === "consultant") data.role = 3;
        result = await employeeService.createEmployee(data);

      } else {
        result = await userService.createUser(data);
      }
      console.log("[AUTH/REGISTER] result:", result);
      Response(res, 201, true, { message: "Đăng ký thành công", data: result });
    } catch (error) {
      console.error("[AUTH/REGISTER] error:", error);
      Response(res, 500, false, { message: error.message });
    }
  },
    // Đăng nhập Google
    loginGoogle: async (req, res) => {
      try {
        const { token } = req.body;
        const { OAuth2Client } = require("google-auth-library");
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
     
        const payload = ticket.getPayload();
        const email = payload.email;
            console.log("[DEBUG] Google payload:", payload);
        // Kiểm tra email đã tồn tại
        let user = await require("../services/humanResources/userService").findByEmail(email);
        if (!user) user = await require("../services/humanResources/adminService").findByEmail(email);
        if (!user) user = await require("../services/humanResources/employeesService").findByEmail(email);
        if (!user) {
          // Tạo tài khoản mới
          user = await require("../services/humanResources/userService").createUser({
            email: payload.email,
            userName: payload.email,
           avatar_url: payload.picture,
           fullName : payload.name,
            // Thêm các trường khác nếu cần
          });
        }
        // Tạo JWT
        const jwt = require("jsonwebtoken");
        const tokenJwt = jwt.sign({
          id: user._id,
          exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 ngày
        }, process.env.JWT_SECRET || "NNPTUD");
        res.cookie("token", `Bearer ${tokenJwt}`, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
Response(res, 200, true, { message: "Đăng nhập Google thành công" });
      } catch (error) {
         console.error("[ERROR] Google login error:", error);
        Response(res, 401, false, { message: error.message });
      }
    },
  // Đăng nhập tài khoản
  login: async (req, res) => {
    console.log("[DEBUG] /auth/loginGoogle CALLED, body =", req.body);
    try {
      const { email, password } = req.body;
      // Tìm user theo email (ưu tiên admin, employee, user)
      let user = await adminService.findByEmail(email);
      if (!user) user = await employeeService.findByEmail(email);
      if (!user) user = await userService.findByEmail(email);
      if (!user) throw new Error("User not found");
      // Kiểm tra password
      const isMatch = await require("../utils/passwordHash").comparePassword(
        password,
        user.password
      );
      if (!isMatch) throw new Error("Invalid password");
      const token = jwt.sign(
        {
          id: user._id,
          exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 ngày
        },
        process.env.JWT_SECRET || "NNPTUD"
      );
      res.cookie("token", `Bearer ${token}`, {
        httpOnly: true,
        secure: false, // Để false khi dev local, true khi production (https)
        sameSite: "lax", // Để "lax" khi dev local, "strict" khi production
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      // Không trả về thông tin user, chỉ trả về message
      Response(res, 200, true, { message: "Đăng nhập thành công" });
    } catch (error) {
      Response(res, 401, false, { message: error.message });
    }
  },

  // Đăng xuất tài khoản
  logout: async (req, res) => {
    try {
      res.cookie("token", "", { maxAge: 0 }); // Xóa cookie
      Response(res, 200, true, { message: "Logout successful" });
    } catch (error) {
      Response(res, 500, false, {
        message: "Logout failed",
        error: error.message,
      });
    }
  },

  // Quên mật khẩu (gửi link đặt lại)
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const userService = require("../services/humanResources/userService");
      let user = await userService.findByEmail(email);
      if (!user) return Response(res, 404, false, "Email không tồn tại");

      // Generate token
      const crypto = require("crypto");
      const token = crypto.randomBytes(32).toString("hex");
      // Set expiry to 60 minutes
      user.forgotPasswordToken = token;
      user.forgotPasswordTokenExp = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();

      const frontendUrl = process.env.CLIENT_URL?.split(",")[0] || "http://localhost:3000";
  // Frontend route for reset page is /reset-password/:token
  const resetUrl = `${frontendUrl.replace(/\/$/,"")}/reset-password/${token}`;

      // Send email
      const { sendMail } = require("../services/emailService");
      try {
        await sendMail(user.email, "forgotPassword", user.fullName || user.userName || "Người dùng", resetUrl);
      } catch (err) {
        console.warn("Gửi mail forgot password thất bại:", err.message);
      }

      return Response(res, 200, true, { message: "Đã gửi link đặt lại mật khẩu", resetUrl });
    } catch (error) {
      console.error("[AUTH] forgotPassword error:", error);
      return Response(res, 500, false, { message: error.message });
    }
  },

  // Reset mật khẩu bằng token
  resetPassword: async (req, res) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;
      const userService = require("../services/humanResources/userService");
      // find user by token
      const User = require("../schemas/humanResources/user.model");
      let user = await User.findOne({ forgotPasswordToken: token, isDeleted: { $ne: true } }).select("+password");
      if (!user) return Response(res, 404, false, "Token không tồn tại");
      if (!user.forgotPasswordTokenExp || user.forgotPasswordTokenExp < Date.now()) {
        user.forgotPasswordToken = "";
        user.forgotPasswordTokenExp = null;
        await user.save();
        return Response(res, 400, false, "Token đã hết hạn");
      }

      // Set new password (pre-save hook will hash)
      user.password = newPassword;
      user.forgotPasswordToken = "";
      user.forgotPasswordTokenExp = null;
      await user.save();

      return Response(res, 200, true, "Đổi mật khẩu thành công");
    } catch (error) {
      console.error("[AUTH] resetPassword error:", error);
      return Response(res, 500, false, { message: error.message });
    }
  },
};

module.exports = authController;