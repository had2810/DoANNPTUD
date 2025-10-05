const baseService = require("../baseService");
const EmployeeWorkSchedule = require("../../schemas/repairScheduling/employeeWork.model");

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

module.exports = employeeWorkService;
