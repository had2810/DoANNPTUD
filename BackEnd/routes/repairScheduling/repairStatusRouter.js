const express = require("express");
const repairStatusController = require("../../controllers/repairScheduling/repairStatusController.js");
const { checkAccessToken } = require("../../middleware/authJwtMiddleware.js");
const { checkRole } = require("../../middleware/checkRoleMiddleware.js");

const router = express.Router();

// Create a new repair status
router.post("/", checkAccessToken, repairStatusController.createRepairStatus);

// Get all repair statuses
router.get("/", checkAccessToken, repairStatusController.getAllRepairStatuses);

// Get a repair status by ID
router.get(
  "/:id",
  checkAccessToken,
  repairStatusController.getRepairStatusById
);

// Update a repair status by ID
router.put(
  "/:id",
  checkAccessToken,
  repairStatusController.updateRepairStatusById
);

// Soft-delete a repair status by ID
router.put(
  "/delete/:id",
  checkAccessToken,
  checkRole("admin"),
  repairStatusController.deleteRepairStatusById
);

module.exports = router;
