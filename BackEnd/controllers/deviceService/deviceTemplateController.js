const express = require("express");
const baseController = require("../baseController");
const deviceTemplateService = require("../../services/deviceService/deviceTemplateService");

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

module.exports = deviceTemplateController;
