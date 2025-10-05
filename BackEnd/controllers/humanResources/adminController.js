import express from "express";
import adminService from "../../services/humanResources/adminService.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import _ from "lodash";

const adminController = {
  //Add Admin
  registerAdmin: async (req, res) => {
    try {
      const admin = await adminService.createAdmin(req.body);
      res.status(201).json(admin);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Login Admin
  loginAdmin: async (req, res) => {
    try {
      const admin = await adminService.checkPassword(
        req.body.email,
        req.body.password
      );
      const accessToken = generateAccessToken({
        id: admin._id,
        email: admin.email,
        role: admin.role,
      });

      const refreshToken = generateRefreshToken({
        id: admin._id,
        email: admin.email,
        role: admin.role,
      });

      res.status(200).json({
        message: "Login successful",
        admin,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get All Admins
  getAllAdmins: async (req, res) => {
    try {
      const admins = await adminService.getAll();
      res.status(200).json(admins);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get An Admin
  getAdmin: async (req, res) => {
    try {
      const admin = await adminService.getById(req.params.id);
      res.status(200).json(admin);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update An Admin
  updateAdmin: async (req, res) => {
    try {
      const updateData = _.pick(req.body, [
        "firstName",
        "lastName",
        "fullName",
        "email",
        "phoneNumber",
        "avatar_url",
        "address",
      ]);

      const admin = await adminService.updateAdmin(req.params.id, updateData);
      res.status(200).json({
        message: "Admin updated successfully",
        admin,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete An Admin
  deleteAdmin: async (req, res) => {
    try {
      const admin = await adminService.delete(req.params.id);
      res.status(200).json({
        message: "Admin deleted successfully",
        id: admin._id,
        email: admin.email,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Change Password
  changePassword: async (req, res) => {
    try {
      const updateData = _.pick(req.body, ["oldPassword", "newPassword"]);
      if (!updateData.oldPassword || !updateData.newPassword) {
        return res.status(400).json({ message: "Missing old or new password" });
      }

      const admin = await adminService.changePassword(
        req.params.id,
        updateData.oldPassword,
        updateData.newPassword
      );
      res.status(200).json({ message: "Password changed successfully", admin });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default adminController;
