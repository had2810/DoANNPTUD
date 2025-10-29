import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAvailableTimeByDate = async (dateStr) => {
  const response = await axios.get(
    `${API_URL}/schedule/available-time/by-date?date=${dateStr}`
  );
  return response.data;
};

const getAvailableTimeByMonth = async (monthStr) => {
  const response = await axios.get(
    `${API_URL}/schedule/available-time/by-month?month=${monthStr}`
  );
  return response.data;
};

const getAnAvailableTime = async (employeeWorkScheduleId, dateStr) => {
  const response = await axios.get(
    `${API_URL}/schedule/available-time/employee-work-schedule?employeeWorkScheduleId=${employeeWorkScheduleId}&date=${dateStr}`
  );
  return response.data;
};

const getMonthSchedule = async (employeeId, monthStr) => {
  const response = await axios.get(
    `${API_URL}/schedule/monthly-status?employeeId=${employeeId}&month=${monthStr}`
  );
  return response.data;
};

const setDayOff = async (employeeId, dateStr) => {
  const response = await axios.post(`${API_URL}/schedule/set-day-off`, {
    employeeId,
    dateStr,
  });
  return response.data;
};

const removeDayOff = async (employeeId, dateStr) => {
  const response = await axios.post(`${API_URL}/schedule/remove-day-off`, {
    employeeId,
    dateStr,
  });
  return response.data;
};

export default {
  getAvailableTimeByDate,
  getAvailableTimeByMonth,
  getAnAvailableTime,
  getMonthSchedule,
  setDayOff,
  removeDayOff,
};
