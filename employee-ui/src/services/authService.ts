import axios from "axios";
import { getAccessToken } from "@/lib/authStorage";
import type {
  LoginRequest,
  LoginResponse,
  ApiResponse,
  Employee,
} from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

const loginEmployee = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    `${API_URL}/auth/login`,
    payload,
    { withCredentials: true }
  );
  return response.data;
};

const getMe = async (): Promise<ApiResponse<Employee>> => {
  const response = await axios.get<ApiResponse<Employee>>(
    `${API_URL}/auth/me`,
    { withCredentials: true }
  );
  return response.data;
};

export { loginEmployee, getMe };
export type { LoginRequest, LoginResponse, Employee };
