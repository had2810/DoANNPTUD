const express = require("express");
const deviceUserController = require("../../controllers/deviceService/deviceUserController.js");
const { authenticate, authorize } = require("../../utils/authHandler.js");

const router = express.Router();

// Create a new device user (User only)
router.post("/", authenticate, authorize("User"), deviceUserController.createDeviceUser);

// Get all device users (Admin only)
router.get("/", authenticate, authorize("Admin"), deviceUserController.getDeviceUsers);

// Get a device user by ID (Authenticated)
router.get("/:id", authenticate, deviceUserController.getDeviceUserById);

// Update a device user (User only)
router.put("/:id", authenticate, authorize("User"), deviceUserController.updateDeviceUser);

// Soft-delete a device user (Admin only)
router.put("/delete/:id", authenticate, authorize("Admin"), deviceUserController.deleteDeviceUser);

module.exports = router;
