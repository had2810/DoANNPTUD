const express = require("express");
const EmployeeController = require("../../controllers/humanResources/employeeController.js");
const { authenticate, authorize } = require("../../utils/authHandler.js");

const router = express.Router();

/* ---------- PUBLIC ---------- */

// Đã chuyển login sang authRouter

/* ---------- PRIVATE ---------- */

// Get All Employees (Authenticated)
router.get("/", authenticate, EmployeeController.getAllEmployees);

// Get Single Employee (Authenticated)
router.get(":/id", authenticate, EmployeeController.getEmployee);

// Update Employee (Authenticated)
router.put("/:id", authenticate, EmployeeController.updateEmployee);

// Soft-delete Employee (Admin only)
router.put(
  "/delete/:id",
  authenticate,
  authorize("Admin"),
  EmployeeController.deleteEmployee
);

// Change Password (Authenticated)
router.put("/:id/password", authenticate, EmployeeController.changePassword);
// Đã chuyển logout sang authRouter
module.exports = router;
