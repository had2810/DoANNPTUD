import axios from "axios";
import { getAccessToken } from "@/lib/authStorage";
import type {
  User,
  DeviceTemplate,
  Service,
  Employee,
  Appointment,
} from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

const getAppointments = async (): Promise<Appointment[]> => {
  const token = getAccessToken();
  const response = await axios.get(`${API_URL}/appointments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

const getAppointmentById = async (id: string): Promise<Appointment> => {
  const token = getAccessToken();
  const response = await axios.get(`${API_URL}/appointments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const updateAppointment = async (
  id: string,
  appointment: Partial<Appointment>
): Promise<Appointment> => {
  const token = getAccessToken();
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

const getUnresolvedAppointmentsCount = async (): Promise<{ count: number }> => {
  const token = getAccessToken();
  const response = await axios.get(`${API_URL}/appointments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const unresolvedStatuses = ["pending", "confirmed"];
  const unresolved = response.data.data.filter((appointment: Appointment) =>
    unresolvedStatuses.includes(appointment.status)
  );

  return { count: unresolved.length };
};

export {
  getAppointments,
  getAppointmentById,
  updateAppointment,
  getUnresolvedAppointmentsCount,
};
export type { Appointment, User, DeviceTemplate, Service, Employee };
