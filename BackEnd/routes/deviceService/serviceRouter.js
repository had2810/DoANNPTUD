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

// Soft-delete a service via PUT
router.put("/delete/:id", serviceController.deleteService);

// (Hard delete route removed) Use PUT /:id/soft-delete for soft-deletes.

module.exports = router;
