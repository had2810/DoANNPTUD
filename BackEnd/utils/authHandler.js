const jwt = require("jsonwebtoken");
const User = require("../schemas/humanResources/user.model");
const Permission = require("../schemas/humanResources/permissions.model");

module.exports = {
  authenticate: async (req, res, next) => {
    try {
      // Lấy token từ header Authorization hoặc cookie
      let token = req.headers.authorization;
      if (!token && req.cookies.token) {
        token = req.cookies.token;
      }
      console.log("[AUTHENTICATE] Raw token:", token);
      if (!token) {
        return res.status(403).json({ message: "user chua dang nhap" });
      }
      // Loại bỏ tiền tố 'Bearer ' nếu có (dù là header hay cookie)
      if (token.startsWith("Bearer ")) {
        token = token.slice(7);
      }
      console.log("[AUTHENTICATE] Token after strip Bearer:", token);

      // Xác thực token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || "NNPTUD");
      } catch (err) {
        console.log("[AUTHENTICATE] Token verify error:", err.message);
        return res
          .status(403)
          .json({ message: "token khong hop le", error: err.message });
      }

      console.log("[AUTHENTICATE] Decoded:", decoded);

      // Kiểm tra thời gian hết hạn
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        console.log(
          "[AUTHENTICATE] Token expired:",
          decoded.exp,
          Date.now() / 1000
        );
        return res.status(403).json({ message: "token da het han" });
      }

      // Tìm user trong collection User với role tương ứng

      const user = await User.findById(decoded.id).populate("role");

      console.log("[AUTHENTICATE] User from DB:", user);
      if (user) {
        req.user = {
          id: decoded.id,
          role: user.role,
        };
        return next();
      }

      return res.status(404).json({ message: "user khong ton tai" });
    } catch (error) {
      console.log("[AUTHENTICATE] Catch error:", error);
      return res
        .status(403)
        .json({ message: "token khong hop le", error: error.message });
    }
  },

  authorize: (...requiredRoles) => {
    return async (req, res, next) => {
      try {
        const user = req.user;
        if (!user) {
          return res.status(403).json({ message: "user chua dang nhap" });
        }

        const foundUser = await User.findById(user.id).populate("role");

        if (!foundUser) {
          return res.status(404).json({ message: "user khong ton tai" });
        }

        // Nếu role là object (đã populate)
        const userRoleName =
          typeof foundUser.role === "object"
            ? foundUser.role.role
            : foundUser.role; // fallback nếu chưa populate

        console.log("[AUTHORIZE] User role:", userRoleName);

        if (!requiredRoles.includes(userRoleName)) {
          return res.status(403).json({ message: "ban khong du quyen" });
        }

        next();
      } catch (error) {
        return res
          .status(500)
          .json({ message: "loi phan quyen", error: error.message });
      }
    };
  },
};
