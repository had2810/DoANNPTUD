import baseService from "../baseService.js";
import DeviceTemplate from "../../models/deviceService/deviceTemplate.model.js";
import Service from "../../models/deviceService/service.model.js";

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

export default deviceTemplateService;
