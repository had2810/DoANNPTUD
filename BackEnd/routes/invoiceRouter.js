
const express = require("express");
const router = express.Router();
const Invoice = require("../schemas/invoicePayments/invoice.model");

// GET /api/invoice/find?appointmentId=...&userId=...
router.get("/find", async (req, res) => {
  try {
    const { appointmentId, userId } = req.query;
    if (!appointmentId || !userId) {
      return res.json({ success: false, message: "Thiếu thông tin" });
    }
    const invoice = await Invoice.findOne({ appointmentId, userId, isDeleted: false }).lean();
    if (!invoice) {
      return res.json({ success: false, message: "Không tìm thấy hóa đơn" });
    }
    res.json({ success: true, invoice });
  } catch (err) {
    res.json({ success: false, message: "Lỗi server" });
  }
});

// POST /api/invoice/update-status
router.post('/update-status', async (req, res) => {
  try {
    const { invoiceId } = req.body;
    if (!invoiceId) {
      return res.json({ success: false, message: 'Thiếu invoiceId' });
    }
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.json({ success: false, message: 'Không tìm thấy hóa đơn' });
    }
    if (invoice.status !== 'Paid') {
      invoice.status = 'Paid';
      invoice.paidAt = new Date();
      await invoice.save();
      console.log(`[FRONTEND] ĐÃ CẬP NHẬT Invoice ${invoiceId} → Paid`);
    } else {
      console.log(`[FRONTEND] Invoice ${invoiceId} đã là Paid.`);
    }
    // Cập nhật RepairStatus
    const RepairStatus = require('../schemas/repairScheduling/repairStatus.model');
    const repairStatus = await RepairStatus.findOne({ appointmentId: invoice.appointmentId });
    if (repairStatus) {
      if (repairStatus.status !== 'Completed') {
        repairStatus.status = 'Completed';
        repairStatus.statusLog.push({ status: 'Completed', time: new Date() });
        await repairStatus.save();
        console.log(`[FRONTEND] ĐÃ CẬP NHẬT RepairStatus → Completed cho appointment ${invoice.appointmentId}`);
      } else {
        console.log(`[FRONTEND] RepairStatus đã là Completed.`);
      }
    } else {
      console.log(`[FRONTEND] Không tìm thấy RepairStatus với appointmentId: ${invoice.appointmentId}`);
    }
    res.json({ success: true });
  } catch (err) {
    console.error('[FRONTEND] LỖI:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
