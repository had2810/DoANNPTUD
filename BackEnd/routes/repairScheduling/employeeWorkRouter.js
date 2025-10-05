const express = require("express");
const employeeWorkController = require("../../controllers/repairScheduling/employeeWorkController.js");
const { checkAccessToken } = require("../../middleware/authJwtMiddleware.js");
const { checkRole } = require("../../middleware/checkRoleMiddleware.js");

const router = express.Router();

// Create a new employee work schedule
router.post(
  "/",
  checkAccessToken,
  checkRole("admin"),
  employeeWorkController.createEmployeeWork
);

// Get all employee work schedules
router.get("/", checkAccessToken, employeeWorkController.getEmployeeWork);

// Get my employee work schedule
router.get("/my", checkAccessToken, employeeWorkController.getMyEmployeeWork);

// Get a specific employee work schedule by ID
router.get("/:id", employeeWorkController.getEmployeeWorkById);

// Update an employee work schedule by ID
router.put("/:id", checkAccessToken, employeeWorkController.updateEmployeeWork);

// Delete an employee work schedule by ID
router.delete(
  "/:id",
  checkAccessToken,
  checkRole("admin"),
  employeeWorkController.deleteEmployeeWork
);

module.exports = router;
