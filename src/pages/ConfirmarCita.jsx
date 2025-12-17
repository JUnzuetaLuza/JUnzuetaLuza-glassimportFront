// src/pages/ConfirmarCita.jsx
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constans";

export const ConfirmarCita = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const token = searchParams.get("token");

  const confirmarCita = async () => {
    if (!token) {
      setError("Token no válido");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/reservas/1/confirmar`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (res.ok) {
        setMensaje("✅ ¡Cita confirmada exitosamente!");
        setTimeout(() => navigate("/"), 3000);
      } else {
        setError("❌ Error al confirmar. El link puede haber expirado.");
      }
    } catch (err) {
      setError("❌ Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg" style={{ maxWidth: 500 }}>
        <div className="card-body p-5 text-center">
          <i className="bi bi-calendar-check display-1 text-primary mb-4"></i>
          <h2 className="mb-4">Confirmar tu Cita</h2>

          {mensaje && (
            <div className="alert alert-success">{mensaje}</div>
          )}

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {!mensaje && !error && (
            <>
              <p className="text-muted mb-4">
                Por favor, confirma tu asistencia a la cita programada.
              </p>

              <button
                className="btn btn-primary btn-lg w-100"
                onClick={confirmarCita}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Procesando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Confirmar Cita
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
