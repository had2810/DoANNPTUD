// Get current user info (cookie-based auth)

const express = require("express");
const userController = require("../../controllers/humanResources/userController.js");
const { authenticate, authorize } = require("../../utils/authHandler.js");

const router = express.Router();

/* ---------- PUBLIC ---------- */

/* ---------- PRIVATE ---------- */

// Get All Users (Admin only)
router.get("/", authenticate, authorize("Admin"), userController.getAllUsers);

// Get Single User (Authenticated)
router.get("/:id", authenticate, userController.getUser);

// Update User (Authenticated)
router.put("/:id", authenticate, userController.updateUser);

// Soft-delete User (Admin only)
router.put(
  "/delete/:id",
  authenticate,
  authorize("Admin"),
  userController.deleteUser
);

// Change Password (Authenticated)
router.put("/:id/password", authenticate, userController.changePassword);
// Đã chuyển logout sang authRouter
module.exports = router;
