import axios from "axios";
import type { RepairStatus } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

const getRepairStatuses = async (): Promise<RepairStatus[]> => {
  const response = await axios.get(`${API_URL}/repair-status-device`, {
    withCredentials: true,
  });
  return response.data;
};

const getRepairStatusByAppointmentId = async (
  appointmentId: string
): Promise<RepairStatus> => {
  const response = await axios.get(
    `${API_URL}/repair-status-device/by-appointment/${appointmentId}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

const updateRepairStatus = async (
  id: string,
  payload: Partial<RepairStatus>
): Promise<RepairStatus> => {
  const response = await axios.put(
    `${API_URL}/repair-status-device/${id}`,
    payload,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export { getRepairStatusByAppointmentId, updateRepairStatus };
export type { RepairStatus };
export { getRepairStatuses };