import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const createDeviceTemplate = async (deviceTemplate) => {
  const response = await axios.post(
    `${API_URL}/device-template`,
    deviceTemplate,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const getAllDeviceTemplates = async () => {
  const response = await axios.get(`${API_URL}/device-template`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const updateDeviceTemplate = async (id, deviceTemplate) => {
  const response = await axios.put(
    `${API_URL}/device-template/${id}`,
    deviceTemplate,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

const deleteDeviceTemplate = async (id) => {
  const response = await axios.delete(`${API_URL}/device-template/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const getDeviceTemplateById = async (id) => {
  const response = await axios.get(`${API_URL}/device-template/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export default {
  createDeviceTemplate,
  getAllDeviceTemplates,
  updateDeviceTemplate,
  deleteDeviceTemplate,
  getDeviceTemplateById,
};
