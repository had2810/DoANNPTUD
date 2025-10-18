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
    `${API_URL}/employee/login`,
    payload
  );
  return response.data;
};

const getMe = async (): Promise<ApiResponse<Employee>> => {
  const token = getAccessToken();
  const response = await axios.get<ApiResponse<Employee>>(
    `${API_URL}/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export { loginEmployee, getMe };
export type { LoginRequest, LoginResponse, Employee };
