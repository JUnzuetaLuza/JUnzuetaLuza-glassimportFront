import { Link, Outlet } from "react-router-dom"; // Importar 'Link' desde 'react-router-dom' si estás usando v6+
import "./panel-cita.css";

export const PanelCitaLayout = () => {
  const navLinks = [
    {
      iconclassName: "bi bi-house-door",
      label: "Inicio",
      href: "/panel-citas",
    },
    {
      iconclassName: "bi bi-calendar-plus",
      label: "Nueva cita",
      href: "/panel-citas/nueva-cita",
    },
    {
      iconclassName: "bi bi-calendar-event",
      label: "Mis Citas",
      href: "/panel-citas/mis-citas",
    },
    {
      iconclassName: "bi bi-question-circle",
      label: "Ayuda",
      href: "/panel-citas/help",
    },
  ];

  /**
   * 🔒 Lógica para Cerrar Sesión
   * Esta función es la que se ejecuta cuando el usuario hace clic en "Cerrar Sesión".
   */
  const logout = () => {
    console.log("Cerrando sesión...");
    
    // 1. ELIMINAR TOKEN/CREDENTIALS: Borra el token de autenticación del almacenamiento local.
    // **Ajusta 'authToken' al nombre real de la clave que uses para guardar el token.**
    localStorage.removeItem('authToken'); 
    
    // 2. REDIRECCIÓN: Redirige al usuario a la página de inicio de sesión.
    // **Ajusta '/login' a la URL de tu página de inicio de sesión.**
    window.location.href = '/login'; 

    // Opcional: También podrías hacer una llamada a la API del servidor para invalidar la sesión, 
    // si usas sesiones de servidor.
    // fetch('/api/logout', { method: 'POST' }); 
  };

  return (
    <>
      <div className="sidebar d-flex flex-column">
        <div className="text-center mb-4">
          <img src="/img/logo.png" alt="glassimport" width="120" />
        </div>
        <ul>
          {navLinks.map(({ href, iconclassName, label }, i) => (
            <li className="list" key={i}>
              <Link to={href}>
                <i className={iconclassName}>{label}</i>
              </Link>
            </li>
          ))}
          {/* Botón de Cerrar Sesión  */}
          <li className="list list-end" onClick={logout}> 
            <a>
              <i className="bi bi-box-arrow-right">Cerrar Sesión</i>
            </a>
          </li>
        </ul>

        <div className="mt-auto text-center small text-muted p-3">
          <p>
            ¿Tienes alguna duda?
            <br />
            ventas@glassimport.net
          </p>
          <a
            href="https://api.whatsapp.com/send/?phone=51972771795&text=%C2%A1Hola%2C+Glass+Import%21+Quiero+solucionar+los+problemas+con+mis+lunas.%20&type=phone_number&app_absent=0"
            className="whatsapp-btn"
            target="_blank"
          >
            <i className="bi bi-whatsapp"></i> Whatsapp
          </a>
        </div>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </>
  );
};
