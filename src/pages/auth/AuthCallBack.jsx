// src/pages/auth/AuthCallback.jsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const ADMIN_USER_ID = "1";

export const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const userId = searchParams.get("userId");
    const userName = searchParams.get("userName");
    const userEmail = searchParams.get("userEmail");

    if (token && userId && userName && userEmail) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      localStorage.setItem("userEmail", userEmail);

      console.log("✅ Login exitoso:", { userId, userName, userEmail });

      // 🚨 REDIRECCIÓN CORRECTA POR ROL
      if (userId === ADMIN_USER_ID) {
        navigate("/admin");
      } else {
        navigate("/panel-citas");
      }
    } else {
      console.error("❌ Faltan parámetros en la URL");
      navigate("/auth?error=true");
    }
  }, [searchParams, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Procesando login...</span>
        </div>
        <p className="text-muted">Iniciando sesión...</p>
      </div>
    </div>
  );
};
