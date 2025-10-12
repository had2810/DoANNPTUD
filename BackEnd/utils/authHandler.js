const jwt = require("jsonwebtoken");
const User = require("../schemas/humanResources/user.model");
const Permission = require("../schemas/humanResources/permissions.model");

module.exports = {
  authenticate: async (req, res, next) => {
    try {
      // Lấy token từ header Authorization hoặc cookie
      let token = req.headers.authorization || req.cookies.token;

      if (!token) {
        return res.status(403).json({ message: "user chua dang nhap" });
      }

      // Loại bỏ tiền tố 'Bearer ' nếu có
      if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
      }

      // Xác thực token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "NNPTUD");

      // Kiểm tra thời gian hết hạn
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        return res.status(403).json({ message: "token da het han" });
      }

      // Tìm user trong collection User với role tương ứng
      const user = await User.findById(decoded.id);
      if (user) {
        let collectionName = "User";
        if (user.role === 1) collectionName = "Admin";
        else if (user.role === 2) collectionName = "Employee";
        
        req.user = { id: decoded.id, collection: collectionName, role: user.role };
        return next();
      }

      return res.status(404).json({ message: "user khong ton tai" });
    } catch (error) {
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

        // Tìm user để lấy role
        const foundUser = await User.findById(user.id);

        if (!foundUser) {
          return res.status(404).json({ message: "user khong ton tai" });
        }

        // Map role numbers to role names
        const roleMap = {
          1: "Admin",
          2: "Employee", 
          4: "User"
        };

        const userRoleName = roleMap[foundUser.role];
        
        if (!userRoleName || !requiredRoles.includes(userRoleName)) {
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
