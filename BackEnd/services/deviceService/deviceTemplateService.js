const baseService = require("../baseService");
const DeviceTemplate = require("../../schemas/deviceService/deviceTemplate.model");
const Service = require("../../schemas/deviceService/service.model");

const deviceTemplateService = {
  ...baseService(DeviceTemplate),
  async update(id, newData) {
    const result = await DeviceTemplate.findByIdAndUpdate(id, newData, {
      new: true,
    });

    // If the device is deactivated
    if (typeof newData.active === "boolean") {
      await Service.updateMany(
        { deviceTemplateId: id },
        { $set: { status: newData.active ? "active" : "inactive" } }
      );
    }

    return result;
  },
};

module.exports = deviceTemplateService;
