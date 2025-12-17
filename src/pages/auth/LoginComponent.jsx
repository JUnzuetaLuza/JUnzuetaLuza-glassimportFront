import { useState } from "react";
import { API_BASE_URL } from "../../utils/constans";

export const LoginComponent = ({ handleFlipped }) => {

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL.split('/api')[0]}/oauth2/authorization/google`;
  };

  return (
    <div className="login-card card-front">
      <div className="card-header">
        <a href="paginaPrincipal.html">
          <i className="fa-solid fa-arrow-right"></i>
        </a>
      </div>

      <div className="card-body">
        <h2>Iniciar Sesión </h2>
        <p className="subtitle">
          ¡Bienvenido! Inicia sesión para acceder al panel de citas.
        </p>
      <button
        onClick={handleGoogleLogin}
        className="google-btn"
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google logo"
          className="google-icon"
        />
        <span>Iniciar sesión con Google</span>
      </button>

        <p className="register-text" style={{ marginTop: "25px" }}>
          
          <span
            onClick={handleFlipped}
            id="show-register"
            className="register-link"
          >
            
          </span>
        </p>

      </div>
    </div>
  );
};

