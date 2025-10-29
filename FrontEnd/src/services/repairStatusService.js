import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const getRepairStatuses = async () => {
  const response = await axios.get(`${API_URL}/repair-status-device`, {
    withCredentials: true,
  });
  return response.data;
};

const updateRepairStatus = async (id, data) => {
  const response = await axios.put(
    `${API_URL}/repair-status-device/${id}`,
    data,
    { withCredentials: true }
  );
  return response.data;
};

const deleteRepairStatus = async (id) => {
  const response = await axios.delete(`${API_URL}/repair-status-device/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export default {
  getRepairStatuses,
  updateRepairStatus,
  deleteRepairStatus,
};
