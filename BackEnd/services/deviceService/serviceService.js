import baseService from "../baseService.js";
import Service from "../../models/deviceService/service.model.js";

const base = baseService(Service, { populateFields: ["deviceTemplateId"] });

const serviceService = {
  ...base,
};

export default serviceService;
