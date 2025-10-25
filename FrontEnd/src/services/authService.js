import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// ---- LOGIN ----
const login = async (email, password) => {
  const response = await axios.post(
    `${API_URL}/auth/login`,
    { email, password },
    { withCredentials: true }
  );
  return response.data;
};

// ---- SIGNUP (User only) ----
const signupUser = async (formData) => {
  const response = await axios.post(
    `${API_URL}/auth/register`,
    {
      ...formData,
      type: "user", // xác định là user thường
    },
    { withCredentials: true }
  );
  return response.data;
};

// ---- GET ME ----
const getMe = async () => {
  const response = await axios.get(`${API_URL}/auth/me`, {
    withCredentials: true,
  });
  return response.data;
};

// ---- LOGOUT ----
const logout = async () => {
  const response = await axios.post(
    `${API_URL}/auth/logout`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

// ---- LOGIN GOOGLE ----
const loginGoogle = async (token) => {
  const response = await axios.post(
    `${API_URL}/auth/loginGoogle`,
    { token },
    { withCredentials: true }
  );
  return response.data;
};

export { login, signupUser, getMe, logout, loginGoogle };

// ---- FORGOT / RESET PASSWORD ----
const forgotPassword = async (email) => {
  const response = await axios.post(
    `${API_URL}/auth/forgotpassword`,
    { email },
    { withCredentials: true }
  );
  return response.data;
};

const resetPassword = async (token, newPassword) => {
  const response = await axios.post(
    `${API_URL}/auth/resetpassword/${token}`,
    { newPassword },
    { withCredentials: true }
  );
  return response.data;
};

export { forgotPassword, resetPassword };