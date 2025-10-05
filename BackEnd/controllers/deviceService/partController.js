import partService from "../../services/deviceService/partService.js";
import baseController from "../baseController.js";

const base = baseController(partService);

const partController = {
  createPart: base.create,
  getParts: base.getAll,
  getPartById: base.getById,
  updatePart: base.update,
  deletePart: base.delete,
};

export default partController;
