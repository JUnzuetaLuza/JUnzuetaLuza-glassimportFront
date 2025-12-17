// src/hooks/useAdmin.js
import { useState, useEffect } from "react";

const ADMIN_USER_ID = 1; // 👈 tu admin real en BD (01 = 1)

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = Number(localStorage.getItem("userId"));
    setIsAdmin(userId === ADMIN_USER_ID);
    setLoading(false);
  }, []);

  return { isAdmin, loading };
};
