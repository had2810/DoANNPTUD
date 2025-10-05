const partsInventoryService = require("../../services/deviceService/partsInventoryService");
const baseController = require("../baseController");

const base = baseController(partsInventoryService);

const partsInventoryController = {
  createPartsInventory: base.create,
  getPartsInventories: base.getAll,
  getPartsInventoryById: base.getById,
  updatePartsInventory: base.update,
  deletePartsInventory: base.delete,
};

module.exports = partsInventoryController;
