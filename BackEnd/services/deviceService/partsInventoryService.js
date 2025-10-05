import baseService from "../baseService.js";
import PartsInventory from "../../models/deviceService/partsInventory.model.js";

const base = baseService(PartsInventory, { populateFields: ["partId"] });
const partsInventoryService = {
  ...base,
};

export default partsInventoryService;
