// User
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: number;
  avatar_url?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Device
export interface DeviceTemplate {
  _id: string;
  name: string;
  type: string;
  brand: string;
  image_url: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Service
export interface Service {
  _id: string;
  serviceName: string;
  serviceType: string;
  imageUrl: string;
  estimatedCompletionTime: string;
  estimatedDuration: number;
  description: string;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Employee
export interface Employee {
  _id?: string;
  email: string;
  role: number;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  phone?: string; // tùy API có thể là `phone` hoặc `phoneNumber`
  address: string;
  avatar_url?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Appointment
export interface Appointment {
  _id: string;
  userId: User;
  deviceTemplateId: DeviceTemplate;
  serviceId: Service;
  employeeId?: string | Employee;
  appointmentTime: string;
  description: string;
  imageUrls: string[];
  estimatedCost: number;
  status: "pending" | "confirmed" | "cancelled";
  orderCode: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}

export interface Shift {
  _id: string;
  employeeId: User;
  startTime: string;
  endTime: string;
  startHour: string;
  endHour: string;
  excludedDates: string[];
  appointmentId: Appointment[];
  status: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface AvailableTimeData {
  timeSlots: string[];
  appointmentToday?: Appointment[];
}

export * from "./schedule";
export * from "./calendar";
