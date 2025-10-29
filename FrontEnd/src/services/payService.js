import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";


const payService = {

  // MoMo (mới)
  createMomoPayUrl: async (invoiceId, amount, token) => {
    const res = await axios.post(
      `${API_BASE}/pay/momo`,
      { invoiceId, amount },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }
    );
    return res.data;
  },
};

export default payService;
