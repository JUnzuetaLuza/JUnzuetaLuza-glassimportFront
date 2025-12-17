import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { useRegisterMutation } from "../../stores/auth/auth-api";
import { validEmail } from "../../utils/valid-email";

export const RegisterComponent = ({ handleFlipped }) => {
  const [register, {}] = useRegisterMutation();
  const [error, setError] = useState();
  const { formState, onInputChange, onResetForm } = useForm({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { username, email, password, confirmPassword } = formState;

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      setError("Campos incompletos");
      return;
    }
    if (!validEmail(email)) {
      // validEmail(email) si el email es valido retorna true, por ende invertimos el true para que no entre aqui
      setError("Email inválido");
      return;
    }

    if (password && password.length <= 6) {
      setError("Contraseña debe ser de minimo 6 caracteres");
      return;
    }

    if (
      password != confirmPassword ||
      password.length !== confirmPassword.length
    ) {
      setError("Contraseñas no coinciden");
      return;
    }

    try {
      const data = await register({
        email: email.toLowerCase(),
        password: password,
        username: username,
      });
      console.log(data);
    } catch (err) {
    } finally {
      setError("");
      onResetForm();
    }
  };

  return (
    <div className="login-card card-back">
      <div className="card-header">
        <i className="fa-solid fa-user-plus"></i>
      </div>
      <div className="card-body">
        <h2>CREAR CUENTA</h2>
        <p className="subtitle">Crea una cuenta para iniciar sesion </p>

        <form id="registerForm" onSubmit={handleRegister} autoComplete="off">
          <div className="input-group">
            <i className="fas fa-user icon"></i>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={onInputChange}
              placeholder="Nombre completo"
              required
            />
          </div>

          <div className="input-group">
            <i className="fas fa-envelope icon"></i>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onInputChange}
              placeholder="Correo electrónico"
              required
            />
          </div>

          <div className="input-group password-group">
            <i className="fas fa-lock icon"></i>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onInputChange}
              id="password"
              placeholder="Contraseña"
              required
            />
            <i className="fas fa-eye-slash toggle-password"></i>
          </div>

          <div className="input-group password-group">
            <i className="fas fa-lock icon"></i>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onInputChange}
              placeholder="Confirmar contraseña"
              required
            />
            <i className="fas fa-eye-slash toggle-password"></i>
          </div>

          {error && <p>{error}</p>}
          <button type="submit" className="btn-get-started">
            Registrarse
          </button>
        </form>

        <p className="register-text">
          ¿Ya tienes una cuenta?
          <span
            onClick={handleFlipped}
            id="show-login"
            className="register-link"
          >
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
};
