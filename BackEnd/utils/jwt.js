// JWT utilities are commented out for local testing of other APIs.
// Restore the implementation when ready to test authentication flows.

function generateAccessToken(payload) {
  return `dev-access-token`;
}

function generateRefreshToken(payload) {
  return `dev-refresh-token`;
}

function verifyAccessToken(token) {
  // For dev, accept any token and return a dummy user
  return { id: "dev-user", email: "dev@example.com", role: "admin" };
}

function verifyRefreshToken(token) {
  return { id: "dev-user", email: "dev@example.com", role: "admin" };
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
