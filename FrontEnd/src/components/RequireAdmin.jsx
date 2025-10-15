import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMe } from "@/services/authService";

const RequireAdmin = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    getMe()
      .then((res) => {
        if (!mounted) return;
        // role._id === 1 là admin
        if (res?.data?.role?._id === 1) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setError(true);
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return null; // Or a spinner
  if (error || !isAdmin) return <Navigate to="/login" replace />;
  return children;
};

export default RequireAdmin;
