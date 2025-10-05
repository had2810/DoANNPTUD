import baseController from "../baseController.js";
import deviceUserService from "../../services/deviceService/deviceUserService.js";

const base = baseController(deviceUserService);

const deviceUserController = {
  createDeviceUser: base.create,
  getDeviceUsers: base.getAll,
  getDeviceUserById: base.getById,
  updateDeviceUser: base.update,
  deleteDeviceUser: base.delete,
};

export default deviceUserController;
