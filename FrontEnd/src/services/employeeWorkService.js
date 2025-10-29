import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const createEmployeeWork = async (employeeWork) => {
  const response = await axios.post(`${API_URL}/employee-work`, employeeWork, {
    withCredentials: true,
  });
  return response.data;
};

const getAllEmployeeWorks = async () => {
  const response = await axios.get(`${API_URL}/employee-work`, {
    withCredentials: true,
  });
  return response.data;
};

const updateEmployeeWork = async (id, employeeWork) => {
  const response = await axios.put(
    `${API_URL}/employee-work/${id}`,
    employeeWork,
    { withCredentials: true }
  );
  return response.data;
};

const deleteEmployeeWork = async (id) => {
  const response = await axios.delete(`${API_URL}/employee-work/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

const getEmployeeWorkById = async (id) => {
  const response = await axios.get(`${API_URL}/employee-work/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export default {
  createEmployeeWork,
  getAllEmployeeWorks,
  updateEmployeeWork,
  deleteEmployeeWork,
  getEmployeeWorkById,
};
