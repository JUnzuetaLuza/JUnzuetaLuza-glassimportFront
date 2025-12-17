import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const TokenSuccessGoogle = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const procesarToken = async () => {
      try {
        // Obtener el token de la URL
        const token = searchParams.get("token");

        if (!token) {
          setError("No se recibió el token de autenticación");
          setLoading(false);
          return;
        }

        // Decodificar el token JWT para obtener la información del usuario
        const payload = JSON.parse(atob(token.split('.')[1]));

        // Guardar el token y datos del usuario en localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", payload.sub || payload.userId || payload.id);
        localStorage.setItem("userEmail", payload.email);
        localStorage.setItem("userName", payload.name || payload.username);

        // Opcional: Guardar el objeto completo del usuario
        localStorage.setItem("user", JSON.stringify({
          id: payload.sub || payload.userId || payload.id,
          email: payload.email,
          name: payload.name || payload.username,
          picture: payload.picture || ""
        }));

        console.log("Login exitoso:", {
          userId: payload.sub || payload.userId,
          email: payload.email
        });

        // Redirigir al panel de usuario después de 1 segundo
        setTimeout(() => {
          navigate("/panel-usuario");
        }, 1000);

      } catch (err) {
        console.error("Error al procesar el token:", err);
        setError("Error al procesar la autenticación. Intenta nuevamente.");
        setLoading(false);

        // Redirigir al login después de 3 segundos en caso de error
        setTimeout(() => {
          navigate("/auth");
        }, 3000);
      }
    };

    procesarToken();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <h4>Iniciando sesión...</h4>
          <p className="text-muted">Por favor espera un momento</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: "4rem" }}></i>
          <h4 className="mt-3 text-danger">Error de autenticación</h4>
          <p className="text-muted">{error}</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/auth")}
          >
            Volver al login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <i className="bi bi-check-circle text-success" style={{ fontSize: "4rem" }}></i>
        <h4 className="mt-3">¡Login exitoso!</h4>
        <p className="text-muted">Redirigiendo...</p>
      </div>
    </div>
  );
};