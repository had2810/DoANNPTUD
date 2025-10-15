import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const updateAdmin = async (adminId, adminData) => {
  const response = await axios.put(`${API_URL}/admin/${adminId}`, adminData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const changePassword = async (adminId, passwordData) => {
  const response = await axios.put(
    `${API_URL}/admin/${adminId}/password`,
    passwordData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export default {
  updateAdmin,
  changePassword,
};
