const baseService = require("../baseService");
const Part = require("../../schemas/deviceService/part.model");

const partService = {
  ...baseService(Part),
};

module.exports = partService;
