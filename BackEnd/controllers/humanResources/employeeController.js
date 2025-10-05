const express = require("express");
const employeesService = require("../../services/humanResources/employeesService");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/jwt");
const _ = require("lodash");

const EmployeeController = {
  // Add New Employee
  addEmployee: async (req, res) => {
    try {
      const employee = await employeesService.createEmployee(req.body);
      res.status(201).json(employee);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Login Employee
  loginEmployee: async (req, res) => {
    try {
      const employee = await employeesService.checkPassword(
        req.body.email,
        req.body.password
      );
      const accessToken = generateAccessToken({
        id: employee._id,
        email: employee.email,
        role: employee.role,
      });
      const refreshToken = generateRefreshToken({
        id: employee._id,
        email: employee.email,
        role: employee.role,
      });
      res.status(200).json({
        message: "Login successful",
        employee,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //Get An Employee
  getEmployee: async (req, res) => {
    try {
      const employee = await employeesService.getById(req.params.id);
      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get All Employees
  getAllEmployees: async (req, res) => {
    try {
      const employees = await employeesService.getAll();
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update Employee
  updateEmployee: async (req, res) => {
    try {
      const updateData = _.pick(req.body, [
        "firstName",
        "lastName",
        "fullName",
        "email",
        "phoneNumber",
        "address",
        "role",
        "avatar_url",
        "status",
      ]);

      const employee = await employeesService.updateEmployee(
        req.params.id,
        updateData
      );
      res.status(200).json({ message: "Employee updated", employee });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete Employee
  deleteEmployee: async (req, res) => {
    try {
      const employee = await employeesService.deleteEmployee(req.params.id);
      res.status(200).json({
        message: "Employee deleted",
        id: req.params.id,
        result: employee,
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
      const employee = await employeesService.changePassword(
        req.params.id,
        updateData.oldPassword,
        updateData.newPassword
      );
      res
        .status(200)
        .json({ message: "Password changed successfully", employee });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = EmployeeController;
