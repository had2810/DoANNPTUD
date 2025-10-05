import baseController from "../baseController.js";
import repairStatusService from "../../services/repairScheduling/repairStatusService.js";

const base = baseController(repairStatusService);
const repairStatusController = {
  createRepairStatus: base.create,
  getAllRepairStatuses: base.getAll,
  getRepairStatusById: base.getById,
  updateRepairStatusById: async (req, res) => {
    try {
      const updated = await repairStatusService.updateStatusWithLog(
        req.params.id,
        req.body
      );
      res.json(updated);
    } catch (error) {
      console.error("❌ Lỗi updateRepairStatusById:", error);
      res.status(500).json({
        message: error.message || "Không thể cập nhật trạng thái",
      });
    }
  },
  deleteRepairStatusById: base.delete,
};

export default repairStatusController;
