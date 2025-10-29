import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface Props {
  children: ReactNode;
}

interface DecodedToken {
  role: number | string; // Có thể là số hoặc chuỗi tùy backend
  exp: number;
}

const RequireEmployee: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    const allowedRoles = [2, 3]; // Technician and Consultant

    // 👇 Nếu token hết hạn hoặc không có quyền hợp lệ
    if (isExpired || !allowedRoles.includes(Number(decoded.role))) {
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error("Token không hợp lệ:", error);
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default RequireEmployee;
// ...existing code from src/employee-ui/src/components/RequireEmployee.tsx
