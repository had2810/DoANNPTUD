const express = require("express");
const baseController = require("../baseController");
const serviceService = require("../../services/deviceService/serviceService");

const base = baseController(serviceService);
const serviceController = {
  createService: base.create,
  getAllServices: base.getAll,
  getServiceById: base.getById,
  updateService: base.update,
  // Soft-delete via PUT (use base.delete which will be soft by default)
  deleteService: base.delete,
};

module.exports = serviceController;
