import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const updateAdmin = async (adminId, adminData) => {
  const response = await axios.put(`${API_URL}/admin/${adminId}`, adminData, {
    withCredentials: true, // ✅ cho phép gửi cookie chứa token
  });
  return response.data;
};

const changePassword = async (adminId, passwordData) => {
  const response = await axios.put(
    `${API_URL}/admin/${adminId}/password`,
    passwordData,
    { withCredentials: true }
  );
  return response.data;
};

export default { updateAdmin, changePassword };
