
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const invoiceService = {
  findInvoice: async (appointmentId, userId) => {
    const res = await axios.get(`${API_BASE}/invoice/find`, {
      params: { appointmentId, userId },
      headers: { 'Cache-Control': 'no-cache' }
    });
    return res.data;
  },
    updateStatus: async (invoiceId) => {
    const res = await axios.post(`${API_BASE}/invoice/update-status`, { invoiceId });
    return res.data;
  },
  // Thêm các hàm khác nếu cần
};

export default invoiceService;
