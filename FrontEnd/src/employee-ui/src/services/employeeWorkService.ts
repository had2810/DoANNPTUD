import axios from "axios";
import { getAccessToken } from "@/lib/authStorage";

const API_URL = import.meta.env.VITE_API_URL;

const createEmployeeWork = async (employeeWork) => {
  const token = getAccessToken();
  const response = await axios.post(`${API_URL}/employee-work`, employeeWork, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const getAllEmployeeWorks = async () => {
  const token = getAccessToken();
  const response = await axios.get(`${API_URL}/employee-work`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const getMyEmployeeWorks = async () => {
  const token = getAccessToken();
  const response = await axios.get(`${API_URL}/employee-work/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const updateEmployeeWork = async (id, employeeWork) => {
  const token = getAccessToken();
  const response = await axios.put(
    `${API_URL}/employee-work/${id}`,
    employeeWork,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

const deleteEmployeeWork = async (id) => {
  const token = getAccessToken();
  const response = await axios.delete(`${API_URL}/employee-work/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const getEmployeeWorkById = async (id) => {
  const token = getAccessToken();
  const response = await axios.get(`${API_URL}/employee-work/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export default {
  createEmployeeWork,
  getMyEmployeeWorks,
  getAllEmployeeWorks,
  updateEmployeeWork,
  deleteEmployeeWork,
  getEmployeeWorkById,
};
