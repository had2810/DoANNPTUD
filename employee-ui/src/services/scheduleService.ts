import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface AvailableTimeResponse {
  data: {
    timeSlots: string[];
    appointmentToday?: Appointment[];
  };
}

interface MonthScheduleResponse {
  data: {
    date: string;
    status: "available" | "semi_busy" | "light_busy" | "full" | "off";
    appointmentCount: number;
  }[];
}

interface DayOffResponse {
  data: {
    success: boolean;
    message: string;
  };
}

interface Appointment {
  _id: string;
  appointmentTime: string;
  serviceId?: { serviceName?: string };
  userId?: { phoneNumber?: string; fullName?: string };
  description?: string;
  status?: string;
}

const getAvailableTime = async (
  dateStr: string
): Promise<AvailableTimeResponse> => {
  const response = await axios.get(
    `${API_URL}/schedule/available-time?date=${dateStr}`
  );
  return response.data;
};

const getAnAvailableTime = async (
  employeeWorkScheduleId: string,
  dateStr: string
): Promise<AvailableTimeResponse> => {
  const response = await axios.get(
    `${API_URL}/schedule/available-time/employee-work-schedule?employeeWorkScheduleId=${employeeWorkScheduleId}&date=${dateStr}`
  );
  return response.data;
};

const getMonthSchedule = async (
  employeeId: string,
  monthStr: string
): Promise<MonthScheduleResponse> => {
  const response = await axios.get(
    `${API_URL}/schedule/monthly-status?employeeId=${employeeId}&month=${monthStr}`
  );
  return response.data;
};

const setDayOff = async (
  employeeId: string,
  dateStr: string
): Promise<DayOffResponse> => {
  const response = await axios.post(`${API_URL}/schedule/set-day-off`, {
    employeeId,
    dateStr,
  });
  return response.data;
};

const removeDayOff = async (
  employeeId: string,
  dateStr: string
): Promise<DayOffResponse> => {
  const response = await axios.post(`${API_URL}/schedule/remove-day-off`, {
    employeeId,
    dateStr,
  });
  return response.data;
};

export default {
  getAvailableTime,
  getAnAvailableTime,
  getMonthSchedule,
  setDayOff,
  removeDayOff,
};
