import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const registerUser = async (data) => {
  const response = await axios.post(`${API_URL}/user/register`, data, {
    withCredentials: true,
  });
  return response.data;
};

const getAllCustomers = async () => {
  const response = await axios.get(`${API_URL}/user/`, {
    withCredentials: true,
  });
  return response.data;
};

const deleteCustomer = async (id) => {
  const response = await axios.delete(`${API_URL}/user/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

const updateCustomer = async (id, data) => {
  const response = await axios.put(`${API_URL}/user/${id}`, data, {
    withCredentials: true,
  });
  return response.data;
};

const changePassword = async (oldPassword, newPassword) => {
  const response = await axios.put(
    `${API_URL}/user/change-password`,
    { oldPassword, newPassword },
    { withCredentials: true }
  );
  return response.data;
};

export default {
  registerUser,
  getAllCustomers,
  deleteCustomer,
  updateCustomer,
  changePassword,
};
