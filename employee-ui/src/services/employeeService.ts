import axios from "axios";
import { getAccessToken } from "@/lib/authStorage";

const API_URL = import.meta.env.VITE_API_URL;

const getEmployees = async () => {
  const token = getAccessToken();
  const response = await axios.get(`${API_URL}/employee/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export default {
  getEmployees,
};
