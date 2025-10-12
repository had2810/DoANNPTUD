const express = require("express");
const employeeWorkController = require("../../controllers/repairScheduling/employeeWorkController.js");
const { authenticate, authorize } = require("../../utils/authHandler.js");

const router = express.Router();

// Create a new employee work schedule (Admin only)
router.post(
  "/",
  authenticate,
  authorize("Admin"),
  employeeWorkController.createEmployeeWork
);

// Get all employee work schedules (Admin only)
router.get("/", authenticate, authorize("Admin"), employeeWorkController.getEmployeeWork);

// Get my employee work schedule (Employee only)
router.get("/my", authenticate, authorize("Employee"), employeeWorkController.getMyEmployeeWork);

// Get a specific employee work schedule by ID (Authenticated)
router.get("/:id", authenticate, employeeWorkController.getEmployeeWorkById);

// Update an employee work schedule by ID (Admin only)
router.put("/:id", authenticate, authorize("Admin"), employeeWorkController.updateEmployeeWork);

// Soft-delete an employee work schedule by ID (Admin only)
router.put(
  "/delete/:id",
  authenticate,
  authorize("Admin"),
  employeeWorkController.deleteEmployeeWork
);

module.exports = router;
