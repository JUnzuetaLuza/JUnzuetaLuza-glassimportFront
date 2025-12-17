import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../../../utils/constans";

export const InicioPanelCita = () => {
  const [searchParams] = useSearchParams();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { getUserId } = useAuth();
  const userId = getUserId();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", payload.sub || payload.userId || payload.id);
        localStorage.setItem("userEmail", payload.email || "");
        localStorage.setItem("userName", payload.name || payload.username || "Usuario");
        localStorage.setItem("user", JSON.stringify({
          id: payload.sub || payload.userId || payload.id,
          email: payload.email || "",
          name: payload.name || payload.username || "Usuario"
        }));
        window.history.replaceState({}, '', window.location.pathname);
        window.location.reload();
      } catch (err) {
        console.error("Error procesando token:", err);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const cargarCitas = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/reservas/user/${userId}`);
        if (!response.ok) throw new Error("Error al cargar las citas");
        const data = await response.json();
        setCitas((data || []).sort((a, b) => new Date(a.fecha) - new Date(b.fecha)));
        setError("");
      } catch (err) {
        setError("No se pudieron cargar las citas");
        setCitas([]);
      } finally {
        setLoading(false);
      }
    };
    cargarCitas();
  }, [userId]);

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate();
    const mes = fecha.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
    return { dia, mes };
  };

  const formatearHora = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getEstadoColor = (estado) => {
    switch (estado?.toUpperCase()) {
      case 'PENDIENTE': return 'badge-warning';
      case 'CONFIRMADA': return 'badge-success';
      case 'CANCELADA': return 'badge-danger';
      case 'COMPLETADA': return 'badge-info';
      default: return 'badge-secondary';
    }
  };

  return (
    <div className="inicio-citas-main">
      <div className="welcome-card">
        <h2>¡Bienvenid@ a Glass Import!</h2>
        <p>Estamos aquí para ayudarte.</p>
      </div>
      <div className="next-citas-wrapper">
        <h3>
          <span className="icon-calendar"></span>
          Tus próximas citas
        </h3>
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="mt-3">Cargando tus citas...</p>
          </div>
        )}
        {error && (
          <div className="alert alert-error mt-3">
            <span className="icon-alert"></span>
            {error}
          </div>
        )}
        {!loading && !error && citas.length === 0 && (
          <div className="alert alert-info mt-3">
            <span className="icon-info"></span>
            No tienes citas programadas. ¡Agenda tu primera cita!
          </div>
        )}
        {!loading && !error && citas.length > 0 && (
          <div className="citas-list">
            {citas.map((cita) => {
              const { dia, mes } = formatearFecha(cita.fecha);
              const hora = formatearHora(cita.fecha);

              return (
                <div key={cita.id} className="cita-card">
                  <div className="cita-card-header">
                    <div className="date-chip">
                      <span className="date-dia">{dia}</span>
                      <span className="date-mes">{mes}</span>
                    </div>
                    <span className={`badge ${getEstadoColor(cita.estado)}`}>
                      {cita.estado || 'PENDIENTE'}
                    </span>
                  </div>
                  <div className="cita-detail">
                    {cita.servicio && (
                      <div className="detail-row">
                        <span className="icon-wrench"></span>
                        <span>{cita.servicio}</span>
                      </div>
                    )}
                    {cita.automovil && (
                      <div className="detail-row detail-car">
                        <span className="icon-car"></span>
                        <span>
                          <strong>{cita.automovil.marca} {cita.automovil.modelo}</strong>
                          {cita.automovil.anio && ` (${cita.automovil.anio})`}
                        </span>
                        {cita.automovil.placa && (<span className="placa">Placa: {cita.automovil.placa}</span>)}
                      </div>
                    )}
                    <div className="detail-row">
                      <span className="icon-clock"></span>
                      <span>{hora}</span>
                    </div>
                    {cita.automovil?.nota && (
                      <div className="detail-row detail-nota">
                        <span className="icon-chat"></span>
                        <span>{cita.automovil.nota}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <p className="agenda-tip">
        ¿Necesitas agendar una nueva cita? Dirígete a la sección "Nueva Cita"
      </p>
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap');
      .inicio-citas-main {
        min-height: 100vh;
        background: #eef4f5;
        font-family: 'Inter', sans-serif;
        padding: 20px 0 40px 0;
      }
      .welcome-card {
        background: white;
        border-radius: 16px;
        max-width: 420px;
        margin: 0 auto 36px auto;
        text-align: center;
        padding: 34px 16px 22px 16px;
        box-shadow: 0 2px 16px #e2e8f0;
      }
      .welcome-card h2 {
        font-weight: 900;
        font-size: 2rem;
        color: #1a9ca9;
        margin-bottom: 8px;
      }
      .welcome-card p {
        color: #262728;
        font-size: 1.1rem;
        font-weight: 500;
      }
      .next-citas-wrapper {
        max-width: 680px;
        margin: 0 auto;
        background: white;
        border-radius: 16px;
        padding: 30px 18px 20px 18px;
        box-shadow: 0 2px 14px #e2e8f0;
      }
      .next-citas-wrapper h3 {
        font-size: 1.35rem;
        font-weight: 800;
        color: #1a9ca9;
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 16px;
      }
      .icon-calendar::before { content: "📅"; }
      .icon-alert::before { content: "⚠️"; }
      .icon-info::before { content: "ℹ️"; }
      .icon-wrench::before { content: "🔧"; }
      .icon-car::before { content: "🚗"; }
      .icon-clock::before { content: "⏰"; }
      .icon-chat::before { content: "💬"; }
      .loading-container { text-align: center; padding: 60px 0 10px 0; }
      .spinner {
        width: 36px;
        height: 36px;
        border: 4px solid #eee;
        border-top-color: #1a9ca9;
        border-radius: 50%;
        margin: 0 auto;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        from { transform: rotate(0deg);}
        to { transform: rotate(360deg);}
      }
      .alert {
        display: flex;
        align-items: center;
        gap: 10px;
        border-radius: 8px;
        padding: 16px 20px;
        font-weight: 700;
        font-size: 1rem;
      }
      .alert-error { background: #fee; color: #b91c1c; border: 1px solid #fcc; }
      .alert-info { background: #e6f7ff; color: #2176b6; border: 1px solid #b4e9ff; }
      .citas-list { display: flex; flex-direction: column; gap: 18px; }
      .cita-card {
        border-radius: 13px;
        border: 2px solid #f0f4fa;
        background: #fafdff;
        box-shadow: 0 2px 12px #e0e6ed6c;
        padding: 16px 15px 12px 15px;
        transition: box-shadow 0.25s;
        position: relative;
      }
      .cita-card:hover { box-shadow: 0 6px 40px #51bacd29; }
      .cita-card-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 10px;
      }
      .date-chip {
        background: #e9fafc;
        border-radius: 12px;
        padding: 8px 10px;
        min-width: 53px;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-weight: 800;
        margin-right: 8px;
      }
      .date-dia { font-size: 1.7rem; color: #1a9ca9; }
      .date-mes { font-size: 0.95rem; color: #262728; line-height: 16px; font-weight: bold; }
      .badge {
        padding: 5px 13px 4px 13px;
        border-radius: 7px;
        font-size: 0.92rem;
        font-weight: 700;
        letter-spacing: 0.01em;
        text-transform: uppercase;
      }
      .badge-success { background: #8de6a3; color: #065f46;}
      .badge-warning { background: #f9dcc4; color: #b15e13;}
      .badge-danger { background: #f3b7bd; color: #a2253b;}
      .badge-info { background: #b6e0fb; color: #085178;}
      .badge-secondary { background: #bdbcc4; color: #35343e;}
      .cita-detail { margin-top: 0.2rem; }
      .detail-row {
        display: flex; align-items: center; gap: 8px; color: #25292d; font-size: 1rem; margin-bottom: 2px;
      }
      .detail-car strong { font-size: 1.04rem; color: #107887; }
      .placa { font-size: 0.98rem; color: #888; margin-left: 6px; }
      .agenda-tip {
        margin-top: 44px;
        text-align: center;
        color: #6c737a;
        font-size: 1.02rem;
      }
      `}</style>
    </div>
  );
};
