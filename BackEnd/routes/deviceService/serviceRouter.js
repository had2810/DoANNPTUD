const express = require("express");
const serviceController = require("../../controllers/deviceService/serviceController.js");
const { authenticate, authorize } = require("../../utils/authHandler.js");

const router = express.Router();

// Create a new service (Admin only)
router.post("/", authenticate, authorize("Admin"), serviceController.createService);

// Get all services (Authenticated)
router.get("/", authenticate, serviceController.getAllServices);

// Get a service by ID (Authenticated)
router.get("/:id", authenticate, serviceController.getServiceById);

// Update a service (Admin only)
router.put("/:id", authenticate, authorize("Admin"), serviceController.updateService);

// Soft-delete a service (Admin only)
router.put("/delete/:id", authenticate, authorize("Admin"), serviceController.deleteService);

// (Hard delete route removed) Use PUT /:id/soft-delete for soft-deletes.

module.exports = router;
