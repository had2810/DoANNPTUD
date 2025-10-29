import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const getAllServices = async () => {
  const response = await axios.get(`${API_URL}/service`, {
    withCredentials: true,
  });
  return response.data;
};

const createService = async (service) => {
  const response = await axios.post(`${API_URL}/service`, service, {
    withCredentials: true,
  });
  return response.data;
};

const updateService = async (id, service) => {
  const response = await axios.put(`${API_URL}/service/${id}`, service, {
    withCredentials: true,
  });
  return response.data;
};

const deleteService = async (id) => {
  const response = await axios.put(`${API_URL}/service/delete/${id}`, null, {
    withCredentials: true,
  });
  return response.data;
};

export default {
  getAllServices,
  createService,
  updateService,
  deleteService,
};
