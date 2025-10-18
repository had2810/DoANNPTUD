import { Appointment, Shift } from "./index";

export interface AvailableTimeResponse {
  availableTimes?: string[];
  shift?: Shift;
  busySlots?: string[];
  appointmentToday?: Appointment[];
}
