import baseService from "../baseService.js";
import DeviceUser from "../../models/deviceService/deviceUser.model.js";

const base = baseService(DeviceUser, {
  populateFields: ["userId", "deviceTemplateId"],
});
const deviceUserService = {
  ...base,
};

export default deviceUserService;
