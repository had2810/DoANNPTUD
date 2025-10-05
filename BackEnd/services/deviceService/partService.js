import baseService from "../baseService.js";
import Part from "../../models/deviceService/part.model.js";

const partService = {
  ...baseService(Part),
};

export default partService;
