const express = require("express");
const repairStatusController = require("../../controllers/repairScheduling/repairStatusController.js");
const { authenticate, authorize } = require("../../utils/authHandler.js");

const router = express.Router();

// Create a new repair status (Admin only)
router.post("/", authenticate, authorize("Admin"), repairStatusController.createRepairStatus);

// Get all repair statuses (Admin & Employee)
router.get("/", authenticate, authorize("Admin", "Employee"), repairStatusController.getAllRepairStatuses);

// Get a repair status by ID (Authenticated)
router.get(
  "/:id",
  authenticate,
  repairStatusController.getRepairStatusById
);

// Update a repair status by ID (Admin & Employee)
router.put(
  "/:id",
  authenticate,
  authorize("Admin", "Employee"),
  repairStatusController.updateRepairStatusById
);

// Soft-delete a repair status by ID (Admin only)
router.put(
  "/delete/:id",
  authenticate,
  authorize("Admin"),
  repairStatusController.deleteRepairStatusById
);

// Get repair status by Appointment ID (Admin & Employee)
router.get(
  "/by-appointment/:appointmentId",
  authenticate,
  authorize("Admin", "Employee"),
  async (req, res) => {
    try {
      const repairStatusService = require("../../services/repairScheduling/repairStatusService.js");
      const appointmentId = req.params.appointmentId;
      const result = await repairStatusService.getOne({ appointmentId });
      if (!result) {
        return res.status(404).json({ message: "khong tim thay trang thai sua chua" });
      }
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: "loi lay trang thai sua chua", error: error.message });
    }
  }
);

module.exports = router;
