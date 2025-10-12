const express = require("express");
const repairStatusController = require("../../controllers/repairScheduling/repairStatusController.js");
const { authenticate, authorize } = require("../../utils/authHandler.js");

const router = express.Router();

// Create a new repair status (Admin only)
router.post("/", authenticate, authorize("Admin"), repairStatusController.createRepairStatus);

// Get all repair statuses (Admin only)
router.get("/", authenticate, authorize("Admin"), repairStatusController.getAllRepairStatuses);

// Get a repair status by ID (Authenticated)
router.get(
  "/:id",
  authenticate,
  repairStatusController.getRepairStatusById
);

// Update a repair status by ID (Admin only)
router.put(
  "/:id",
  authenticate,
  authorize("Admin"),
  repairStatusController.updateRepairStatusById
);

// Soft-delete a repair status by ID (Admin only)
router.put(
  "/delete/:id",
  authenticate,
  authorize("Admin"),
  repairStatusController.deleteRepairStatusById
);

module.exports = router;
