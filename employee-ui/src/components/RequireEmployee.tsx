import React, { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMe } from "@/services/authService";

interface Props {
  children: ReactNode;
}

const RequireEmployee: React.FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;
    getMe()
      .then((res) => {
        const roleObj = res?.data?.role;
        let roleId = null;
        if (roleObj != null && typeof roleObj === "object") {
          roleId = (roleObj as { _id?: number })._id ?? null;
        } else {
          roleId = roleObj;
        }
        if (roleId === 2 || roleId === 3) {
          if (mounted) setAllowed(true);
        } else {
          if (mounted) setAllowed(false);
        }
      })
      .catch(() => {
        if (mounted) setAllowed(false);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return null;
  if (!allowed) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default RequireEmployee;
