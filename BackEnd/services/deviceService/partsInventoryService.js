const baseService = require("../baseService");
const PartsInventory = require("../../schemas/deviceService/partsInventory.model");

const base = baseService(PartsInventory, { populateFields: ["partId"] });
const partsInventoryService = {
  ...base,
};

module.exports = partsInventoryService;
