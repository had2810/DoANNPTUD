const express = require("express");
const appointmentsController = require("../../controllers/repairScheduling/appointmentsController.js");
const { checkAccessToken } = require("../../middleware/authJwtMiddleware.js");
const { checkRole } = require("../../middleware/checkRoleMiddleware.js");

const router = express.Router();

// Create a new appointment
router.post("/", checkAccessToken, appointmentsController.createAppointment);

// Get all appointments
router.get("/", checkAccessToken, appointmentsController.getAppointments);

// Get Appointment With Phone & OderID
router.get("/lookup", appointmentsController.lookupAppointment);

// Get an appointment by ID
router.get("/:id", checkAccessToken, appointmentsController.getAppointmentById);

// Update an appointment
router.put("/:id", checkAccessToken, appointmentsController.updateAppointment);

// (Hard delete route removed) Use PUT /:id/soft-delete for soft-deletes.

// Soft-delete an appointment (set isDeleted = true)
router.put(
  "/delete/:id",
  checkAccessToken,
  checkRole("admin"),
  appointmentsController.deleteAppointment
);

module.exports = router;
