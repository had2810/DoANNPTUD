const express = require("express");
const permissionController = require("../../controllers/humanResources/permissionController.js");
const { authenticate, authorize } = require("../../utils/authHandler.js");

const permissionRouter = express.Router();

/* ---------- PRIVATE (Require Authentication and Admin Role) ---------- */

// Add Permission (Admin only)
permissionRouter.post(
  "/add",
  authenticate,
  authorize("Admin"),
  permissionController.addPermission
);

// Get Permissions (Admin only)
permissionRouter.get(
  "/",
  authenticate,
  authorize("Admin"),
  permissionController.getPermissions
);

// Update Permission (Admin only)
permissionRouter.put(
  "/update/:id",
  authenticate,
  authorize("Admin"),
  permissionController.updatePermission
);

// Soft-delete Permission (Admin only)
permissionRouter.put(
  "/delete/:id",
  authenticate,
  authorize("Admin"),
  permissionController.deletePermission
);

module.exports = permissionRouter;
