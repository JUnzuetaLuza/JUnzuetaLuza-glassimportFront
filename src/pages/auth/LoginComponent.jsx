import { useState } from "react";
import { API_BASE_URL } from "../../utils/constans";

export const LoginComponent = ({ handleFlipped }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL.split('/api')[0]}/oauth2/authorization/google`;
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();

    fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          window.location.href = "/panel-citas";
        }})
      .catch(error => {
        console.error("Error during login:", error);
      });

  }

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
        {/* <form onSubmit={handleEmailLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input" 
            />
          </div>
          <div className="input-group" style={{ marginTop: "15px" }}>
            <input
              type="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>
          
          <button type="submit" className="login-btn" style={{ marginTop: "20px", marginBottom: "20px" }}>
            Iniciar Sesión
          </button>
        </form>

        <p className="register-text" style={{ marginTop: "25px" }}>

          <span
            onClick={handleFlipped}
            id="show-register"
            className="register-link"
            >
          </span>

        </p>
        
        <p className="or-separator" style={{ textAlign: "center", margin: "10px 0" }}>o</p> */}

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

