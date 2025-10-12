const express = require("express");
const deviceTemplateController = require("../../controllers/deviceService/deviceTemplateController.js");
const { authenticate, authorize } = require("../../utils/authHandler.js");

const router = express.Router();

// Create a new device template (Admin only)
router.post("/", authenticate, authorize("Admin"), deviceTemplateController.createDeviceTemplate);

// Get all device templates (Authenticated)
router.get("/", authenticate, deviceTemplateController.getAllDeviceTemplates);

// Get a device template by ID (Authenticated)
router.get("/:id", authenticate, deviceTemplateController.getDeviceTemplateById);

// Update a device template by ID (Admin only)
router.put("/:id", authenticate, authorize("Admin"), deviceTemplateController.updateDeviceTemplateById);

// Soft-delete a device template by ID (Admin only)
router.put("/delete/:id", authenticate, authorize("Admin"), deviceTemplateController.deleteDeviceTemplateById);

module.exports = router;
