import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const createAppointment = async (appointment) => {
  const response = await axios.post(`${API_URL}/appointments`, appointment, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getAppointments = async (page = 1, limit = 10, searchQuery = "") => {
  const response = await axios.get(`${API_URL}/appointments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getAppointmentById = async (id) => {
  const response = await axios.get(`${API_URL}/appointments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const updateAppointment = async (id, appointment) => {
  const response = await axios.put(
    `${API_URL}/appointments/${id}`,
    appointment,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const deleteAppointment = async (id) => {
  const response = await axios.delete(`${API_URL}/appointments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const lookupAppointment = async (phoneNumber, orderCode) => {
  const response = await axios.get(`${API_URL}/appointments/lookup`, {
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
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  lookupAppointment,
};
