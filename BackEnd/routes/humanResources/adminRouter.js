const express = require("express");
const adminController = require("../../controllers/humanResources/adminController.js");
const { checkAccessToken } = require("../../middleware/authJwtMiddleware.js");
const { checkRole } = require("../../middleware/checkRoleMiddleware.js");

const router = express.Router();
/* Public routes */

// Register Admin
router.post("/register", adminController.registerAdmin);

// Login Admin
router.post("/login", adminController.loginAdmin);

/* Private routes */

// Get All Admins
router.get(
  "/",
  checkAccessToken,
  checkRole("admin"),
  adminController.getAllAdmins
);

// Get An Admin
router.get("/:id", checkAccessToken, adminController.getAdmin);

// Update An Admin
router.put("/:id", checkAccessToken, adminController.updateAdmin);

// Delete An Admin
router.delete(
  "/:id",
  checkAccessToken,
  checkRole("admin"),
  adminController.deleteAdmin
);

// Change Password
router.put("/:id/password", checkAccessToken, adminController.changePassword);

module.exports = router;
