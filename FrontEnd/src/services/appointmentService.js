import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance that always sends credentials (cookies)
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // gửi cookie tự động
});

// ---- APPOINTMENTS ----
const createAppointment = async (appointment) => {
  const response = await api.post(`/appointments`, appointment);
  return response.data;
};
const getMyAppointments = async (page = 1, limit = 10, searchQuery = "") => {
  const response = await api.get(`/appointments/my`, {
    params: { page, limit, search: searchQuery },
  });
  return response.data;
};

const getAppointments = async (page = 1, limit = 10, searchQuery = "") => {
  const response = await api.get(`/appointments`, {
    params: { page, limit, search: searchQuery },
  });
  return response.data;
};

const getAppointmentById = async (id) => {
  const response = await api.get(`/appointments/${id}`);
  return response.data;
};

const updateAppointment = async (id, appointment) => {
  const response = await api.put(`/appointments/${id}`, appointment);
  return response.data;
};

const deleteAppointment = async (id) => {
  const response = await api.delete(`/appointments/${id}`);
  return response.data;
};

const lookupAppointment = async (phoneNumber, orderCode) => {
  const response = await api.get(`/appointments/lookup`, {
    params: {
      phone: phoneNumber,
      orderCode: orderCode,
    },
  });
  return response.data;
};

export default {
  createAppointment,
  getAppointments,
  getMyAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  lookupAppointment,
};
