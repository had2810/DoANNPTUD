const appointmentsService = require("../../services/repairScheduling/appointmentsService");
const baseController = require("../baseController");

const base = baseController(appointmentsService);
const appointmentsController = {
  createAppointment: async (req, res) => {
    try {
      const appointment = await appointmentsService.createAppointment(req.body);
      res.status(201).json(appointment);
    } catch (error) {
      res.status(400).json({
        message: error.message || "Không thể tạo lịch hẹn",
      });
    }
  },
  // Lấy danh sách lịch hẹn của user đang đăng nhập (phân trang, tìm kiếm)
  async getMyAppointments(req, res) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;

      const query = {
        userId: req.user.id,
        ...(search && { orderId: { $regex: search, $options: "i" } }),
      };

      // ✅ Phân trang trên Query (không lỗi .skip)
      const appointments = await appointmentsService
        .findMany(query)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

      const total = await appointmentsService.countDocuments(query);

      res.status(200).json({
        success: true,
        data: appointments,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("❌ Error in getMyAppointments:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy danh sách lịch hẹn",
        error: error.message,
      });
    }
  },

  getAppointments: async (req, res) => {
    try {
      const { role, id } = req.user;
      let filter = {};

      if (role === 2 || role === 3) {
        filter = { employeeId: id };
      } else if (role === 4) {
        filter = { userId: id };
      }

      console.log(">>> USER INFO:", req.user);
      console.log(">>> FILTER:", filter);

      const appointments = await appointmentsService.findMany(filter);
      res.status(200).json({ data: appointments });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lịch hẹn:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  },

  getAppointmentById: base.getById,
  updateAppointment: async (req, res) => {
    try {
      const appointment =
        await appointmentsService.updateAppointmentAutoRepairStatus(
          req.params.id,
          req.body
        );
      res.status(200).json(appointment);
    } catch (error) {
      res.status(400).json({
        message: error.message || "Không thể cập nhật lịch hẹn",
      });
    }
  },
  // Soft-delete an appointment via PUT (handled by base.delete which will soft-delete)
  deleteAppointment: base.delete,
  lookupAppointment: async (req, res) => {
    try {
      const { phone, orderCode } = req.query;

      if (!phone || !orderCode) {
        return res.status(400).json({
          message: "Thiếu số điện thoại hoặc mã đơn",
        });
      }

      const result = await appointmentsService.lookupAppointment({
        phoneNumber: phone,
        orderCode,
      });

      if (!result) {
        return res.status(404).json({
          message: "Không tìm thấy đơn phù hợp.",
        });
      }

      return res.status(200).json(result);
    } catch (err) {
      console.error("Lỗi tra cứu:", err);
      return res.status(500).json({ message: "Lỗi server." });
    }
  },
};

module.exports = appointmentsController;
