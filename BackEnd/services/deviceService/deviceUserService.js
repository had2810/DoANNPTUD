const baseService = require("../baseService");
const DeviceUser = require("../../schemas/deviceService/deviceUser.model");

const base = baseService(DeviceUser, {
  populateFields: ["userId", "deviceTemplateId"],
});
const deviceUserService = {
  ...base,
};

module.exports = deviceUserService;
