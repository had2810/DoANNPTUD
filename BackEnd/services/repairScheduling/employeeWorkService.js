import baseService from "../baseService.js";
import EmployeeWorkSchedule from "../../models/repairScheduling/employeeWork.model.js";

const base = baseService(EmployeeWorkSchedule, {
  populateFields: ["appointmentId", "employeeId"],
});
const employeeWorkService = {
  ...base,
  async findMany(filter = {}) {
    return EmployeeWorkSchedule.find(filter).populate([
      {
        path: "employeeId",
        select: "-password -refreshToken",
      },
      {
        path: "appointmentId",
        populate: [
          { path: "userId", select: "-password -refreshToken" },
          { path: "deviceTemplateId" },
          { path: "serviceId" },
        ],
      },
    ]);
  },
};

export default employeeWorkService;
