const express = require("express");
const Permission = require("../../schemas/humanResources/permissions.model");

const permissionController = {
  // Add Permission
  addPermission: async (req, res) => {
    try {
      const { _id, role, permissions } = req.body;
      const permission = new Permission({
        _id,
        role,
        permissions,
      });
      const newPermission = await permission.save();
      res.status(201).json(newPermission);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get Permissions
  getPermissions: async (req, res) => {
    try {
      const includeDeleted = req.query.includeDeleted === "true";
      const filter = includeDeleted ? {} : { isDeleted: { $ne: true } };
      const permissions = await Permission.find(filter);
      res.status(200).json(permissions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update Permission
  updatePermission: async (req, res) => {
    try {
      const { role, permissions } = req.body;
      const id = req.params.id;
      const permission = await Permission.findOneAndUpdate(
        { _id: id },
        { role, permissions },
        { new: true }
      );
      if (!permission) {
        return res.status(404).json({ message: "Permission not found" });
      }
      res.status(200).json(permission);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Soft-delete Permission (used by PUT /delete/:id)
  deletePermission: async (req, res) => {
    try {
      const permission = await Permission.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { new: true }
      );
      if (!permission) {
        return res.status(404).json({ message: "Permission not found" });
      }
      res.status(200).json(permission);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = permissionController;
