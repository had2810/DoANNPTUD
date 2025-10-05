const express = require("express");
const deviceUserController = require("../../controllers/deviceService/deviceUserController.js");

const router = express.Router();
// Create a new device user
router.post("/", deviceUserController.createDeviceUser);
// Get all device users
router.get("/", deviceUserController.getDeviceUsers);
// Get a device user by ID
router.get("/:id", deviceUserController.getDeviceUserById);
// Update a device user
router.put("/:id", deviceUserController.updateDeviceUser);
// Delete a device user
router.delete("/:id", deviceUserController.deleteDeviceUser);

module.exports = router;
