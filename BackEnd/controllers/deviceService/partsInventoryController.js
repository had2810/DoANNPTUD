const partsInventoryService = require("../../services/deviceService/partsInventoryService");
const baseController = require("../baseController");

const base = baseController(partsInventoryService);

const partsInventoryController = {
  createPartsInventory: base.create,
  getPartsInventories: base.getAll,
  getPartsInventoryById: base.getById,
  updatePartsInventory: base.update,
  // soft delete via PUT (use base.delete which will soft-delete by default)
  deletePartsInventory: base.delete,
};

module.exports = partsInventoryController;
