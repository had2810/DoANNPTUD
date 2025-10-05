const express = require("express");
const serviceController = require("../../controllers/deviceService/serviceController.js");

const router = express.Router();

// Create a new service
router.post("/", serviceController.createService);

// Get all services
router.get("/", serviceController.getAllServices);

// Get a service by ID
router.get("/:id", serviceController.getServiceById);

// Update a service
router.put("/:id", serviceController.updateService);

// Delete a service
router.delete("/:id", serviceController.deleteService);

module.exports = router;
