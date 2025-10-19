const express = require("express");
const appointmentsController = require("../../controllers/repairScheduling/appointmentsController.js");
const { authenticate, authorize } = require("../../utils/authHandler.js");

const router = express.Router();
// Get appointments of current user (User only)
router.get(
  "/my",
  authenticate,
  authorize("User"),
  appointmentsController.getMyAppointments
);

// Create a new appointment (User only)
router.post(
  "/",
  authenticate,
  authorize("User", "Admin"),
  appointmentsController.createAppointment
);

// Get all appointments (Admin, Employee, Consultant)
router.get(
  "/",
  authenticate,
  authorize("Admin", "Employee", "Consultant"),
  appointmentsController.getAppointments
);

// Get Appointment With Phone & OrderID (Public)
router.get("/lookup", appointmentsController.lookupAppointment);

// Get an appointment by ID (Authenticated)
router.get("/:id", authenticate, appointmentsController.getAppointmentById);

// Update an appointment (Admin only)
router.put(
  "/:id",
  authenticate,
  authorize("Admin","Employee"),
  appointmentsController.updateAppointment
);

// Soft-delete an appointment (Admin only)
router.put(
  "/delete/:id",
  authenticate,
  authorize("Admin"),
  appointmentsController.deleteAppointment
);

module.exports = router;
