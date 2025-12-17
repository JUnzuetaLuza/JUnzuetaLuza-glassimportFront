
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Edit, LogOut, Shield } from "lucide-react";

const NavItem = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isExactMatch = location.pathname === to;
  const isSubPath = to !== "/admin" && location.pathname.startsWith(to);
  const isActive = isExactMatch || isSubPath;

  return (
    <Link
      to={to}
      className={`admin-nav-item ${isActive ? "active" : ""}`}
    >
      <Icon size={20} className="admin-nav-icon" />
      <span className="admin-nav-label">{label}</span>
    </Link>
  );
};

const Logo = () => (
  <div className="admin-logo-container">
    <Shield size={40} className="admin-logo-icon" />
    <h2 className="admin-logo-text">ADMIN PANEL</h2>
  </div>
);

export const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que quieres cerrar la sesión?")) {
      // Limpia sesión
      localStorage.clear();
      navigate("/auth");
    }
  };

  return (
    <nav className="admin-sidebar-nav">
      <Logo />

      <div className="admin-nav-list">
        {/* Inicio Admin */}
        <NavItem to="/admin" icon={Home} label="Inicio" />

        {/* Editar Citas */}
        <NavItem to="/admin/editar-cita" icon={Edit} label="Editar Cita" />

        <div className="admin-nav-separator"></div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="admin-nav-item admin-logout-btn"
        >
          <LogOut size={20} className="admin-nav-icon" />
          <span className="admin-nav-label">Cerrar Sesión</span>
        </button>
      </div>
            {/* ... (Estilos) ... */}
            <style>{`
                .admin-sidebar-nav {
                    width: 250px;
                    background: #47bad6ff; 
                    color: white;
                    padding: 20px 0;
                    box-shadow: 4px 0 10px rgba(7, 7, 7, 0.1);
                    position: fixed;
                    height: 100%;
                    top: 0;
                    left: 0;
                    z-index: 1000;
                    font-family: 'Inter', sans-serif;
                }
                .admin-logo-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 30px;
                    gap: 10px;
                }
                .admin-logo-icon { color: #1a9ca9; }
                .admin-logo-text { font-size: 1.25rem; font-weight: 800; margin: 0; }
                .admin-nav-list { padding: 0 15px; }
                .admin-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 15px;
                    border-radius: 8px;
                    margin-bottom: 8px;
                    color: #ffffffff;
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    background: none;
                    border: none;
                    width: 100%;
                    text-align: left;
                    cursor: pointer;
                }
                .admin-nav-item:hover {
                    color: white;
                    background: #1a9ca9;
                }
                .admin-nav-item.active {
                    background: #1a9ca9;
                    color: white;
                    box-shadow: 0 4px 10px rgba(26, 156, 169, 0.4);
                }
                .admin-logout-btn {
                    margin-top: 20px;
                    color: #ffffffff; 
                }
                .admin-logout-btn:hover {
                    background: #1a9ca9;
                    color: #751111ff; 
                }
                .admin-nav-separator {
                    height: 1px;
                    background: rgba(255, 255, 255, 0.1);
                    margin: 15px 0;
                }
            `}</style>
        </nav>
    );
};