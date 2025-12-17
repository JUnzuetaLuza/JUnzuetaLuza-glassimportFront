import { Link, Outlet, useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
// Solo necesitas subir dos niveles para llegar a la carpeta 'src'
// y luego bajar a 'components'.
import Footer from "../../components/Footer";


export const LandingPageLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/contact", label: "¿Quiénes somos?" },
    { href: "/servicios", label: "Servicios" }
  ];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigateToLogin = () => {
    setIsMobileMenuOpen(false);
    navigate("/auth");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`navbar-new ${isScrolled ? "navbar-new--scrolled" : ""}`}
      >
        <div className="navbar-new__container">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/" className="brand-new">
              <img src="img/logo.png" alt="Logo MiEmpresa" className="brand-logo-img" />
              <h1 className="brand-text"></h1>
            </Link>
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className={`menu-btn ${isMobileMenuOpen ? "active" : ""}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span><span></span><span></span>
          </motion.button>

          <div className={`menu-new ${isMobileMenuOpen ? "open" : ""}`}>
            <ul className="menu-new__list">
              {navLinks.map(({ href, label }) => (
                <motion.li key={href} whileHover={{ scale: 1.02 }}>
                  <Link
                    to={href}
                    className={`menu-new__link ${
                      location.pathname === href ? "active" : ""
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {label}
                  </Link>
                </motion.li>
              ))}

              <motion.li whileHover={{ scale: 1.05 }}>
                <button className="btn-login-new" onClick={navigateToLogin}>
                  Ingresar
                </button>
              </motion.li>
            </ul>
          </div>
        </div>
      </motion.nav>

      <main className="main-new">
        <Outlet />
      </main>
<Footer />
      <style>{`
        :root {
          --c1: #1a9ca9;
          --c2: #126c75;
          --bg: #eef4f5;
          --text: #121515;
        }

        body {
          background: var(--bg);
          overflow-x: hidden;
          font-family: 'Inter', sans-serif;
        }

        .navbar-new {
          position: fixed;
          top: 0;
          width: 100%;
          height: 90px;
          display: flex;
          align-items: center;
          backdrop-filter: blur(14px);
          background: rgba(255,255,255,0.45);
          box-shadow: 0 4px 30px rgba(0,0,0,0.05);
          z-index: 99;
          transition: 0.3s;
        }

        .navbar-new--scrolled {
          background: rgba(255,255,255,0.85);
          box-shadow: 0 6px 25px rgba(0,0,0,0.1);
        }

        .navbar-new__container {
          max-width: 1790px;
          margin: auto;
          width: 100%;
          padding: 0 29px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand-new {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .brand-logo-img {
          width: 100px;
          height: 80px;

          object-fit: contain;
          border-radius: 12px;
          filter: drop-shadow(0 4px 12px rgba(26,156,169,0.3));
        }

        .brand-text {
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(200deg, var(--c1), var(--c2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .menu-btn {
          width: 34px;
          height: 34px;
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
        }
        .menu-btn span {
          width: 100%;
          height: 3px;
          background: var(--text);
          border-radius: 2px;
          transition: 0.3s;
        }

        .menu-new {
          display: flex;
        }

        .menu-new__list {
          list-style: none;
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .menu-new__link {
          padding: 10px 18px;
          border-radius: 10px;
          text-decoration: none;
          color: var(--text);
          font-weight: 600;
          transition: 0.25s;
        }

        .menu-new__link:hover,
        .menu-new__link.active {
          background: rgba(26,156,169,0.12);
          color: var(--c1);
        }

        .btn-login-new {
          padding: 12px 26px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(200deg, var(--c1), var(--c2));
          color: #fff;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s;
        }

        .btn-login-new:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(0,0,0,0.18);
        }

        @media (max-width: 900px) {
          .menu-btn { display: flex; }

          .menu-new {
            position: fixed;
            top: 80px;
            right: 0;
            width: 100%;
            height: calc(100% - 80px);
            background: rgba(255,255,255,0.94);
            backdrop-filter: blur(18px);
            transform: translateX(100%);
            opacity: 0;
            transition: 0.4s;
            display: flex;
            justify-content: center;
          }

          .menu-new.open {
            transform: translateX(0);
            opacity: 1;
          }

          .menu-new__list {
            flex-direction: column;
            gap: 20px;
          }

          .brand-logo-img {
            width: 45px;
            height: 45px;
          }

          .brand-text {
            font-size: 18px;
          }
        }

        .main-new {
          margin-top: 110px;
          position: relative;
        }
      `}</style>
    </>
  );
};