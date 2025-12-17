import { useState } from "react";
import "./auth.css";
import { LoginComponent } from "./LoginComponent";
import { RegisterComponent } from "./RegisterComponent";
export const AuthPage = () => {
  const [flipped, setFlipped] = useState(false);

  const onFlipped = () => {
    setFlipped((p) => !p);
  };

  return (
    <div className="body-c">
      <div className="background" id="parallax-bg"></div>

      <div className="login-container">
        <div
          className={`${flipped ? "flipped" : ""} card-wrapper`}
          id="card-wrapper"
        >
          <LoginComponent handleFlipped={onFlipped} />

          <RegisterComponent handleFlipped={onFlipped} />
        </div>
      </div>
    </div>
  );
};
