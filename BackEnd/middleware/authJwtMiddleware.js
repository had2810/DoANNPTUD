// Development middleware to bypass JWT checks so other APIs can be tested.
// Revert to proper implementation when testing authentication.

function checkAccessToken(req, res, next) {
  req.user = req.user || {
    id: "dev-user",
    role: "admin",
    email: "dev@example.com",
  };
  next();
}

function checkRefreshToken(req, res, next) {
  req.user = req.user || {
    id: "dev-user",
    role: "admin",
    email: "dev@example.com",
  };
  next();
}

module.exports = {
  checkAccessToken,
  checkRefreshToken,
};
