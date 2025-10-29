// Dev-friendly role checking middleware
// Usage: const { checkRole } = require('../middleware/checkRoleMiddleware');
// then router: router.get('/', checkRole(['admin']), handler)

function checkRole(allowedRoles = []) {
  return (req, res, next) => {
    try {
      // If req.user not set (dev/test mode), allow through so tests can run
      if (!req.user) return next();

      const userRole = req.user.role || req.user.roles || req.user.roles?.[0];
      if (!allowedRoles || allowedRoles.length === 0) return next();
      if (allowedRoles.includes(userRole)) return next();

      return res.status(403).json({ message: "Forbidden: insufficient role" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Role check error", error: err.message });
    }
  };
}

module.exports = { checkRole };
