import axios from "axios";
// ...existing code...

const API_URL = import.meta.env.VITE_API_URL;

const getEmployees = async () => {
  const response = await axios.get(`${API_URL}/employee/`, {
    withCredentials: true,
  });
  return response.data;
};

export default {
  getEmployees,
};
