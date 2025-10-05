const express = require("express");
const deviceTemplateController = require("../../controllers/deviceService/deviceTemplateController.js");

const router = express.Router();

// Create a new device template
router.post("/", deviceTemplateController.createDeviceTemplate);

// Get all device templates
router.get("/", deviceTemplateController.getAllDeviceTemplates);

// Get a device template by ID
router.get("/:id", deviceTemplateController.getDeviceTemplateById);

// Update a device template by ID
router.put("/:id", deviceTemplateController.updateDeviceTemplateById);

// Delete a device template by ID
router.delete("/:id", deviceTemplateController.deleteDeviceTemplateById);

module.exports = router;
