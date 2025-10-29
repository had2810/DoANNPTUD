const express = require("express");
const adminController = require("../../controllers/humanResources/adminController.js");
const { authenticate, authorize } = require("../../utils/authHandler.js");

const router = express.Router();

/* ---------- PUBLIC ---------- */

// Đã chuyển register, login sang authRouter

/* ---------- PRIVATE (Require Authentication) ---------- */

// Get All Admins (Admin only)
router.get("/", authenticate, authorize("Admin"), adminController.getAllAdmins);

// Get Single Admin (Self or Admin)
router.get("/:id", authenticate, adminController.getAdmin);

// Update Admin (Self)
router.put("/:id", authenticate, adminController.updateAdmin);

// Soft-delete Admin (Admin only)
router.put(
  "/delete/:id",
  authenticate,
  authorize("Admin"),
  adminController.deleteAdmin
);

// Change Password (Self)
router.put("/:id/password", authenticate, adminController.changePassword);

// Đã chuyển logout sang authRouter
module.exports = router;
