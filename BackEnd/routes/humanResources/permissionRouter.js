const express = require("express");
const permissionController = require("../../controllers/humanResources/permissionController.js");

const permissionRouter = express.Router();

// Add Permission
permissionRouter.post("/add", permissionController.addPermission);

// Get Permissions
permissionRouter.get("/", permissionController.getPermissions);

// Update Permission
permissionRouter.put("/update/:id", permissionController.updatePermission);

// Soft-delete permission via PUT
permissionRouter.put("/delete/:id", permissionController.deletePermission);

module.exports = permissionRouter;
