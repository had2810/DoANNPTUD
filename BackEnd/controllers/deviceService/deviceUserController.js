const baseController = require("../baseController");
const deviceUserService = require("../../services/deviceService/deviceUserService");

const base = baseController(deviceUserService);

const deviceUserController = {
  createDeviceUser: base.create,
  getDeviceUsers: base.getAll,
  getDeviceUserById: base.getById,
  updateDeviceUser: base.update,
  deleteDeviceUser: base.delete,
};

module.exports = deviceUserController;
