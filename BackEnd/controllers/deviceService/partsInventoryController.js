import partsInventoryService from "../../services/deviceService/partsInventoryService.js";
import baseController from "../baseController.js";

const base = baseController(partsInventoryService);

const partsInventoryController = {
  createPartsInventory: base.create,
  getPartsInventories: base.getAll,
  getPartsInventoryById: base.getById,
  updatePartsInventory: base.update,
  deletePartsInventory: base.delete,
};

export default partsInventoryController;
