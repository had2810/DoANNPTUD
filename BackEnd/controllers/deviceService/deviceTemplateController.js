import express from "express";
import baseController from "../baseController.js";
import deviceTemplateService from "../../services/deviceService/deviceTemplateService.js";

const base = baseController(deviceTemplateService);
const deviceTemplateController = {
  // Create a new device template
  createDeviceTemplate: base.create,
  // Get all device templates
  getAllDeviceTemplates: base.getAll,
  // Get a device template by ID
  getDeviceTemplateById: base.getById,
  // Update a device template by ID
  updateDeviceTemplateById: base.update,
  // Delete a device template by ID
  deleteDeviceTemplateById: base.delete,
};

export default deviceTemplateController;
