const partService = require("../../services/deviceService/partService");
const baseController = require("../baseController");

const base = baseController(partService);

const partController = {
  createPart: base.create,
  getParts: base.getAll,
  getPartById: base.getById,
  updatePart: base.update,
  deletePart: base.delete,
};

module.exports = partController;
