import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const getAllEmployees = async () => {
  const response = await axios.get(`${API_URL}/employee/`, {
    withCredentials: true,
  });
  return response.data;
};

const deleteEmployee = async (id) => {
  const response = await axios.put(
    `${API_URL}/employee/delete/${id}`,
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
};

const updateEmployee = async (id, data) => {
  const response = await axios.put(`${API_URL}/employee/${id}`, data, {
    withCredentials: true,
  });
  return response.data;
};
const signupEmployee = async (formData) => {
  const response = await axios.post(
    `${API_URL}/auth/register`,
    {
      ...formData,
      userName: formData.email, // 🔥 Gán username = email để tránh trùng null
      type: formData.type || "employee", // mặc định là employee
    },
    { withCredentials: true }
  );
  return response.data;
};
export default {
  getAllEmployees,
  deleteEmployee,
  updateEmployee,
  signupEmployee,
};
