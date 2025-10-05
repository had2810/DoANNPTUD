const baseService = require("../baseService");
const Service = require("../../schemas/deviceService/service.model");

const base = baseService(Service, { populateFields: ["deviceTemplateId"] });

const serviceService = {
  ...base,
};

module.exports = serviceService;
