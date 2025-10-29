import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance that always sends credentials (cookies)
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const createDeviceTemplate = async (deviceTemplate) => {
  const response = await api.post(`/device-template`, deviceTemplate);
  return response.data;
};

const getAllDeviceTemplates = async () => {
  const response = await api.get(`/device-template`);
  return response.data;
};

const updateDeviceTemplate = async (id, deviceTemplate) => {
  const response = await api.put(`/device-template/${id}`, deviceTemplate);
  return response.data;
};

const deleteDeviceTemplate = async (id) => {
  const response = await api.put(`/device-template/delete/${id}`);
  return response.data;
};

const getDeviceTemplateById = async (id) => {
  const response = await api.get(`/device-template/${id}`);
  return response.data;
};

export default {
  createDeviceTemplate,
  getAllDeviceTemplates,
  updateDeviceTemplate,
  deleteDeviceTemplate,
  getDeviceTemplateById,
};
