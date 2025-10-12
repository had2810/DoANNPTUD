const express = require("express");
const appointmentsController = require("../../controllers/repairScheduling/appointmentsController.js");
const { authenticate, authorize } = require("../../utils/authHandler.js");

const router = express.Router();

// Create a new appointment (User only)
router.post("/", authenticate, authorize("User"), appointmentsController.createAppointment);

// Get all appointments (Admin only)
router.get("/", authenticate, authorize("Admin"), appointmentsController.getAppointments);

// Get Appointment With Phone & OrderID (Public)
router.get("/lookup", appointmentsController.lookupAppointment);

// Get an appointment by ID (Authenticated)
router.get("/:id", authenticate, appointmentsController.getAppointmentById);

// Update an appointment (Admin only)
router.put("/:id", authenticate, authorize("Admin"), appointmentsController.updateAppointment);

// Soft-delete an appointment (Admin only)
router.put(
  "/delete/:id",
  authenticate,
  authorize("Admin"),
  appointmentsController.deleteAppointment
);

module.exports = router;
