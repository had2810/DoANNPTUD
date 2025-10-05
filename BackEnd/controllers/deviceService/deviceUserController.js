const baseController = require("../baseController");
const deviceUserService = require("../../services/deviceService/deviceUserService");

const base = baseController(deviceUserService);

const deviceUserController = {
  createDeviceUser: base.create,
  getDeviceUsers: base.getAll,
  getDeviceUserById: base.getById,
  updateDeviceUser: base.update,
  // soft delete via PUT (use base.delete which will soft-delete by default)
  deleteDeviceUser: base.delete,
};

module.exports = deviceUserController;
