const baseController = require("../baseController");
const employeeWorkService = require("../../services/repairScheduling/employeeWorkService");

const base = baseController(employeeWorkService);
const employeeWorkController = {
  createEmployeeWork: base.create,
  getEmployeeWork: base.getAll,
  getMyEmployeeWork: async (req, res) => {
    try {
      const { role, id } = req.user;
      let filter = {};

      if (role === 2 || role === 3) {
        filter = { employeeId: id };
      }

      console.log(">>> USER INFO:", req.user);
      console.log(">>> FILTER:", filter);

      const employeeWork = await employeeWorkService.findMany(filter);
      res.status(200).json({ data: employeeWork });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lịch làm việc:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  },
  getEmployeeWorkById: base.getById,
  updateEmployeeWork: base.update,
  deleteEmployeeWork: base.delete,
};

module.exports = employeeWorkController;
