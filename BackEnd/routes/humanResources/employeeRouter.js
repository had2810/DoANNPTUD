const express = require("express");
const EmployeeController = require("../../controllers/humanResources/employeeController.js");
const { checkAccessToken } = require("../../middleware/authJwtMiddleware.js");
const { checkRole } = require("../../middleware/checkRoleMiddleware.js");

const router = express.Router();

// Add New Employee
router.post(
  "/add",
  checkAccessToken,
  checkRole("admin"),
  EmployeeController.addEmployee
);

// Login Employee
router.post("/login", EmployeeController.loginEmployee);

// Get An Employee
router.get("/:id", checkAccessToken, EmployeeController.getEmployee);

// Get All Employees
router.get("/", checkAccessToken, EmployeeController.getAllEmployees);

// Update Employee
router.put("/:id", checkAccessToken, EmployeeController.updateEmployee);

// Delete Employee
router.delete(
  "/:id",
  checkAccessToken,
  checkRole("admin"),
  EmployeeController.deleteEmployee
);

// Change Password
router.put(
  "/:id/password",
  checkAccessToken,
  EmployeeController.changePassword
);

module.exports = router;
