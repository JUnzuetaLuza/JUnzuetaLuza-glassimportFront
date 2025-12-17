import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { API_BASE_URL } from "../../../utils/constans";

const ESTADOS = [
  { key: "PENDIENTE", label: "Pendientes" },
  { key: "CONFIRMADA", label: "Confirmadas" },
  { key: "CANCELADA", label: "Canceladas" },
  { key: "COMPLETADA", label: "Completadas" }
];

export const MisCitas = () => {
  const { getUserId, getToken } = useAuth();
  const userId = getUserId();
  const [todasLasCitas, setTodasLasCitas] = useState([]);
  const [estadoActivo, setEstadoActivo] = useState("PENDIENTE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarCitas = async () => {
      if (!userId) {
        setError("No se pudo obtener el ID del usuario");
        return;
      }
      setLoading(true);
      setError("");

      try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/reservas/user/${userId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(`Error ${response.status}: No se pudieron cargar las citas`);
        const data = await response.json();
        setTodasLasCitas(data);
      } catch (err) {
        setError(err.message || "Error al cargar las citas");
        setTodasLasCitas([]);
      } finally {
        setLoading(false);
      }
    };
    if (userId) cargarCitas();
  }, [userId]);

  const citasFiltradas = todasLasCitas.filter((cita) => cita.estado === estadoActivo);

  const contarPorEstado = (estado) =>
    todasLasCitas.filter((cita) => cita.estado === estado).length;

  const fechaFormato = (f) => {
    const d = new Date(f);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const horaFormato = (f) => {
    const d = new Date(f);
    return d.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const getBadgeClass = (estado) => {
    switch (estado) {
      case "PENDIENTE": return "badge-warning";
      case "CONFIRMADA": return "badge-success";
      case "CANCELADA": return "badge-danger";
      case "COMPLETADA": return "badge-secondary";
      default: return "badge-secondary";
    }
  };

  return (
    <div className="mis-citas-main">
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap');

      .mis-citas-main {
        min-height: 100vh;
        background: #eef4f5;
        font-family: 'Inter', sans-serif;
        padding: 24px 0 40px 0;
      }

      .mc-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1000px;
        margin: 0 auto 26px auto;
        padding: 0 18px;
      }
      .mc-header h2 {
        font-weight: 900;
        font-size: 1.7rem;
        color: #1a9ca9;
        margin-bottom: 2px;
      }
      .mc-header p {
        color: #464747;
        font-size: 1rem;
      }
      .mc-btn-add {
        background: linear-gradient(120deg, #1a9ca9 60%, #15b2b8);
        color: white;
        padding: 0.55rem 1.35rem;
        border-radius: 10px;
        font-weight: 700;
        text-decoration: none;
        box-shadow: 0 3px 15px #4bbfd52a;
        font-size: 1.1rem;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 5px;
      }
      .mc-btn-add:hover {
        opacity: 0.85;
        transform: translateY(-2px);
        box-shadow: 0 5px 20px #1a9ca9b3;
      }
      .mc-tabs {
        display: flex;
        gap: 1rem;
        max-width: 1000px;
        margin: 0 auto 20px auto;
        padding: 0 18px;
        border-bottom: 2px solid #e3e9f0;
      }
      .mc-tab {
        font-size: 1.05rem;
        font-weight: 700;
        color: #7e8791;
        border: none;
        background: none;
        border-bottom: 3px solid transparent;
        cursor: pointer;
        padding: 12px 24px;
        margin-bottom: -2px;
        transition: 0.21s;
        position: relative;
        outline: none;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .mc-tab.active {
        color: #1a9ca9;
        border-bottom-color: #1a9ca9;
        background: none;
      }
      .badge-count {
        font-size: 0.80rem;
        background: #eaf5f8;
        color: #197687;
        padding: 2px 9px;
        border-radius: 10px;
        font-weight: 800;
        margin-left: 4px;
      }
      .mc-tab.active .badge-count {
        background: #1a9ca9;
        color: #fff;
      }
      .mc-alert {
        max-width: 590px;
        margin: 30px auto;
        background: #f7fcfd;
        border: 1.1px solid #c3dbe2;
        border-radius: 13px;
        padding: 22px 24px 16px;
        font-weight: 700;
        color: #187887;
        display: flex;
        gap: 10px;
        align-items: center;
        font-size: 1rem;
      }
      .mc-alert-error {
        background: #fee;
        color: #bd2d38;
        border-color: #fcc;
      }
      .mc-alert-success {
        background: #effdee;
        color: #16ac4a;
        border-color: #7cffb1;
      }
      .mc-appointments {
        max-width: 1000px;
        margin: 0 auto;
        padding: 0 18px;
      }
      .appointment-card {
        display: flex;
        flex-direction: column;
        gap: 8px;
        background: white;
        border-radius: 13px;
        border: 2px solid #f0f4fa;
        box-shadow: 0 2px 14px #e8eef2;
        padding: 20px 18px 15px 18px;
        margin-bottom: 14px;
        transition: box-shadow 0.21s, transform 0.21s;
      }
      .appointment-card:hover {
        box-shadow: 0 7px 32px #51bacd28;
        transform: translateY(-2px) scale(1.02);
      }
      .appointment-head {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 6px;
      }
      .appointment-date {
        font-size: 2rem;
        font-weight: 800;
        color: #1a9ca9;
        margin-right: 8px;
        line-height: 1;
      }
      .appointment-hour {
        font-size: 1.06rem;
        color: #757982;
        font-weight: 600;
      }
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
      .badge-secondary { background: #bdbcc4; color: #35343e;}
      .appointment-service {
        font-size: 1.07rem;
        color: #178aa1;
        font-weight: 800;
        margin-bottom: 2px;
      }
      .appointment-car {
        font-size: 1.01rem;
        color: #46555f;
        font-weight: 700;
      }
      .appointment-placa {
        font-size: 0.93rem;
        color: #91969d;
        margin-left: 6px;
      }
      .appointment-note {
        color: #879495;
        font-size: 0.92rem;
        margin-top: 3px;
      }
      @media (max-width: 600px){
        .mc-header, .mc-tabs, .mc-appointments { padding: 0 5vw; }
        .appointment-card { padding: 17px 9px; }
        .mc-btn-add{padding: .5rem 1rem;}
      }
      `}
      </style>

      <div className="mc-header">
        <div>
          <h2>Mis Citas</h2>
          <p className="text-muted">Aquí verás tus citas según su estado.</p>
        </div>
        <a href="/panel-cita/nueva-cita" className="mc-btn-add">
          <span>＋</span> Nueva Cita
        </a>
      </div>

      <nav className="mc-tabs" aria-label="Estado de citas">
        {ESTADOS.map(({ key, label }) => (
          <button
            className={`mc-tab${estadoActivo === key ? " active" : ""}`}
            key={key}
            onClick={() => setEstadoActivo(key)}
            type="button"
            aria-selected={estadoActivo === key}
          >
            {label}
            <span className="badge-count">{contarPorEstado(key)}</span>
          </button>
        ))}
      </nav>

      {loading && (
        <div className="mc-alert mc-alert-success">
          <span role="img" aria-label="Cargando">🔄</span>
          Cargando tus citas...
        </div>
      )}

      {error && (
        <div className="mc-alert mc-alert-error">
          <span role="img" aria-label="Error">❌</span>
          {error}
        </div>
      )}

      <section className="mc-appointments">
        {!loading && citasFiltradas.length === 0 && (
          <div className="mc-alert">
            <span role="img" aria-label="Info">ℹ️</span>
            No hay citas en estado <strong>{estadoActivo}</strong>.
          </div>
        )}

        {citasFiltradas.map((cita) => (
          <div key={cita.id} className="appointment-card">
            <div className="appointment-head">
              <span className="appointment-date">{fechaFormato(cita.fecha)}</span>
              <span className="appointment-hour">{horaFormato(cita.fecha)}</span>
              <span className={`badge ${getBadgeClass(cita.estado)}`}>{cita.estado}</span>
            </div>
            {cita.servicio && (
              <div className="appointment-service">🔧 {cita.servicio}</div>
            )}
            {cita.automovil && (
              <div className="appointment-car">
                🚗 {cita.automovil.marca} {cita.automovil.modelo}
                {cita.automovil.anio && ` (${cita.automovil.anio})`}
                {cita.automovil.placa && (
                  <span className="appointment-placa">
                    Placa: <strong>{cita.automovil.placa}</strong>
                  </span>
                )}
              </div>
            )}
            {cita.automovil?.nota && (
              <div className="appointment-note">💬 {cita.automovil.nota}</div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};
