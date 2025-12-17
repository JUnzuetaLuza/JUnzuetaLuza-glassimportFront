import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import { Navigate } from "react-router-dom";
import { useReservasSocket } from "../../hooks/useReservasSocket";

import { motion } from "framer-motion";
import { 
  Clock, CheckCircle, List, Shield, RefreshCw, 
  User, Mail, Car, Hash, Wrench, Calendar, 
  AlertCircle, Check, X 
} from "lucide-react";
import { API_BASE_URL } from "../../utils/constans";

const FILTRO_TABS = [
  { key: "pendiente", label: "Pendientes", icon: Clock, match: ["PENDIENTE"] },
  { key: "aprobada", label: "Aprobadas", icon: Check, match: ["APROBADA"] },
  { key: "confirmada", label: "Confirmadas", icon: CheckCircle, match: ["CONFIRMADA"] },
  { key: "cancelada", label: "Canceladas", icon: X, match: ["CANCELADA"] },
  { key: "todas", label: "Todas", icon: List, match: null },
];

export const PanelAdmin = () => {
  const { isAdmin, loading } = useAdmin();
  const [activeTab, setActiveTab] = useState("pendiente");
  const [reservas, setReservas] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(false);
  const [error, setError] = useState("");

  useReservasSocket(setReservas);

  const cargarReservas = useCallback(async () => {
    setLoadingReservas(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/reservas`);

      if (!res.ok) {
        let errormsg = `HTTP ${res.status}`;
        try {
          const errordata = await res.json();
          errormsg = errordata.error || errordata.message || errormsg;
        } catch {}
        setError("Error al cargar reservas: " + errormsg);
        setReservas([]);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setReservas(data);
      } else {
        console.warn("⚠️ API no retornó array:", data);
        setReservas([]);
      }
    } catch (err) {
      console.error("❌ Error al cargar reservas:", err);
      setError("Error al cargar reservas: " + err.message);
      setReservas([]);
    } finally {
      setLoadingReservas(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      cargarReservas();
    }
  }, [isAdmin, cargarReservas]);

  const aprobarReserva = async (id) => {
    if (!window.confirm("¿Aprobar esta reserva y enviar email al cliente?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/reservas/${id}/aprobar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
        alert("✅ Reserva aprobada y email enviado");
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`❌ Error: ${errorData.error || errorData.message || "No se pudo aprobar"}`);
      }
    } catch (error) {
      console.error("Error al aprobar:", error);
      alert("❌ Error de conexión");
    }
  };

  const cancelarReserva = async (id) => {
    if (!window.confirm("¿Cancelar esta reserva?")) return;

    try {
      const res = await fetch(`http://$/reservas/${id}/cancelar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
        alert("✅ Reserva cancelada");
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`❌ Error: ${errorData.error || errorData.message || "No se pudo cancelar"}`);
      }
    } catch (error) {
      console.error("Error al cancelar:", error);
      alert("❌ Error de conexión");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/panel-citas" replace />;
  }

  const reservasFiltradas = (() => {
    if (!Array.isArray(reservas)) return [];
    if (activeTab === "todas") return reservas;

    const tabConfig = FILTRO_TABS.find(tab => tab.key === activeTab);
    if (!tabConfig || !tabConfig.match) return [];

    return reservas.filter(r => r && r.estado && tabConfig.match.includes(r.estado));
  })();

  const getEstadoBadge = (estado) => {
    const badges = {
      PENDIENTE: "badge-warning",
      APROBADA: "badge-info",
      CONFIRMADA: "badge-success",
      CANCELADA: "badge-danger",
      COMPLETADA: "badge-secondary"
    };
    return badges[estado] || "badge-secondary";
  };

  return (
    <div className="panel-admin">
      <div className="panel-container">
        <motion.div 
          className="panel-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-content">
            <div className="header-title">
              <Shield size={32} className="header-icon" />
              <h1>Panel de Administrador</h1>
            </div>
            <div className="header-badge">
              {reservasFiltradas.length} {activeTab === "todas" ? "reservas" : FILTRO_TABS.find(t => t.key === activeTab)?.label || ""}
            </div>
          </div>
        </motion.div>

        <motion.button
          className="refresh-btn"
          onClick={cargarReservas}
          disabled={loadingReservas}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RefreshCw size={18} className={loadingReservas ? "spinning" : ""} />
          {loadingReservas ? "Actualizando..." : "Refrescar"}
        </motion.button>

        <div className="tabs-container">
          {FILTRO_TABS.map((tab, i) => {
            const IconComponent = tab.icon;
            return (
              <motion.button
                key={tab.key}
                className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <IconComponent size={18} />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {error && (
          <motion.div 
            className="alert alert-error"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AlertCircle size={20} />
            {error}
            <button className="alert-close" onClick={() => setError("")}>×</button>
          </motion.div>
        )}

        {loadingReservas ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : reservasFiltradas.length === 0 ? (
          <div className="alert alert-info">
            <AlertCircle size={20} />
            No hay reservas en este estado
          </div>
        ) : (
          <div className="reservas-grid">
            {reservasFiltradas.map((reserva, i) => {
              if (!reserva || !reserva.id) return null;

              return (
                <motion.div
                  key={reserva.id}
                  className="reserva-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  whileHover={{ y: -5, boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)" }}
                >
                  <div className="card-header-custom">
                    <div className="user-info">
                      <User size={20} />
                      <span>{reserva.user?.username || reserva.user?.email || "Usuario"}</span>
                    </div>
                    <span className={`badge ${getEstadoBadge(reserva.estado)}`}>
                      {reserva.estado || "DESCONOCIDO"}
                    </span>
                  </div>

                  <div className="card-content">
                    <div className="info-row">
                      <Mail size={16} />
                      <span>{reserva.user?.email || "Sin email"}</span>
                    </div>
                    <div className="info-row">
                      <Car size={16} />
                      <span>
                        {reserva.automovil?.marca || ""} {reserva.automovil?.modelo || ""}
                        {reserva.automovil?.anio ? ` (${reserva.automovil.anio})` : ""}
                      </span>
                    </div>
                    <div className="info-row">
                      <Hash size={16} />
                      <span><strong>Placa:</strong> {reserva.automovil?.placa || "Sin placa"}</span>
                    </div>
                    <div className="info-row">
                      <Wrench size={16} />
                      <span><strong>Servicio:</strong> {reserva.servicio || "Sin especificar"}</span>
                    </div>
                    <div className="info-row">
                      <Calendar size={16} />
                      <span>
                        {reserva.fecha ? new Date(reserva.fecha).toLocaleDateString() : "Sin fecha"}
                        {reserva.fecha ? ` - ${new Date(reserva.fecha).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}` : ""}
                      </span>
                    </div>
                  </div>

                  {reserva.estado === "PENDIENTE" && (
                    <div className="card-actions">
                      <motion.button
                        className="btn-action btn-approve"
                        onClick={() => aprobarReserva(reserva.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Check size={16} />
                        Aprobar
                      </motion.button>
                      <motion.button
                        className="btn-action btn-reject"
                        onClick={() => cancelarReserva(reserva.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <X size={16} />
                        Rechazar
                      </motion.button>
                    </div>
                  )}

                  {reserva.estado === "CONFIRMADA" && (
                    <div className="card-status status-confirmed">
                      <CheckCircle size={16} />
                      Cita confirmada por el cliente
                    </div>
                  )}

                  {reserva.estado === "CANCELADA" && (
                    <div className="card-status status-cancelled">
                      <X size={16} />
                      Cita cancelada
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

        .panel-admin {
          min-height: 100vh;
          background: #eef4f5;
          font-family: 'Inter', sans-serif;
          padding: 20px;
        }

        .panel-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .panel-header {
          margin-bottom: 30px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon {
          color: #1a9ca9;
        }

        .header-title h1 {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 900;
          color: #121515;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .header-badge {
          background: linear-gradient(135deg, #1a9ca9, #126c75);
          color: white;
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
        }

        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          color: #2d3748;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 20px;
        }

        .refresh-btn:hover:not(:disabled) {
          border-color: #1a9ca9;
          color: #1a9ca9;
        }

        .refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .tabs-container {
          display: flex;
          gap: 12px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          color: #2d3748;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tab-btn:hover {
          border-color: #1a9ca9;
          color: #1a9ca9;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #1a9ca9, #126c75);
          color: white;
          border-color: transparent;
        }

        .alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-weight: 500;
        }

        .alert-error {
          background: #fee;
          color: #c33;
          border: 1px solid #fcc;
        }

        .alert-info {
          background: #e6f7ff;
          color: #0066cc;
          border: 1px solid #91d5ff;
        }

        .alert-close {
          margin-left: auto;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: inherit;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .alert-close:hover {
          opacity: 1;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 60px 20px;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e2e8f0;
          border-top-color: #1a9ca9;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .reservas-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 768px) {
          .reservas-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1200px) {
          .reservas-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .reserva-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
        }

        .card-header-custom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f7f7f7;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: #121515;
          font-size: 1.05rem;
        }

        .badge {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .badge-warning { background: #fbbf24; color: #78350f; }
        .badge-info { background: #60a5fa; color: #1e3a8a; }
        .badge-success { background: #34d399; color: #065f46; }
        .badge-danger { background: #f87171; color: #7f1d1d; }
        .badge-secondary { background: #9ca3af; color: #1f2937; }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .info-row {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #2d3748;
          font-size: 0.9rem;
        }

        .info-row svg {
          color: #1a9ca9;
          flex-shrink: 0;
        }

        .card-actions {
          display: flex;
          gap: 10px;
        }

        .btn-action {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 16px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-approve {
          background: #34d399;
          color: #065f46;
        }

        .btn-approve:hover {
          background: #10b981;
        }

        .btn-reject {
          background: #f87171;
          color: #7f1d1d;
        }

        .btn-reject:hover {
          background: #ef4444;
        }

        .card-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .status-confirmed {
          background: #d1fae5;
          color: #065f46;
        }

        .status-cancelled {
          background: #fee2e2;
          color: #7f1d1d;
        }
          
      `}</style>
    </div>
  );
};