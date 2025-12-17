import { useState, useEffect } from "react";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        setIsAuthenticated(!!token);
        setLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        setIsAuthenticated(false);
        window.location.href = "/auth";
    };

    const getUserId = () => localStorage.getItem("userId");
    const getUserEmail = () => localStorage.getItem("userEmail");
    const getUserName = () => localStorage.getItem("userName");

    // ✅ AGREGAR ESTA FUNCIÓN
    const getToken = () => localStorage.getItem("authToken");

    return {
        isAuthenticated,
        loading,
        logout,
        getUserId,
        getUserEmail,
        getUserName,
        getToken  // ✅ Exportar getToken
    };
};
