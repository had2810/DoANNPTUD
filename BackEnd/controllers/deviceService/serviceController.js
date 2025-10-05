import express from "express";
import baseController from "../baseController.js";
import serviceService from "../../services/deviceService/serviceService.js";

const base = baseController(serviceService);
const serviceController = {
  createService: base.create,
  getAllServices: base.getAll,
  getServiceById: base.getById,
  updateService: base.update,
  deleteService: base.delete,
};

export default serviceController;
