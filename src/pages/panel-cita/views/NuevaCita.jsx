import { useRef, useEffect, useState } from "react";
import { useVehiculos } from "../../../hooks/useVehiculos";
import { useAuth } from "../../../hooks/useAuth";
import { API_BASE_URL } from "../../../utils/constans";

const TIEMPO_LIMITE_MS = 3 * 60 * 1000;
// Expresión regular para validar la placa: 6 a 10 caracteres, solo letras mayúsculas, números y guiones.
const PLACA_REGEX = /^[A-Z0-9-]{6,10}$/;
const MAX_NOTA_CHARS = 500;

export const NuevaCita = () => {
  const { marcas, cargarModelos } = useVehiculos();
  const { getUserId, getToken } = useAuth();

  // 🔹 NUEVO: catálogos desde backend
  const [serviciosApi, setServiciosApi] = useState([]);
  const [horariosApi, setHorariosApi] = useState([]);
  const [loadingCatalogos, setLoadingCatalogos] = useState(false);
  const [errorCatalogos, setErrorCatalogos] = useState("");

  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState("");
  const [placa, setPlaca] = useState("");
  const [nota, setNota] = useState("");
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [fechaCita, setFechaCita] = useState("");
  const [horarioSeleccionado, setHorarioSeleccionado] = useState("");
  const [estadoHorarios, setEstadoHorarios] = useState({});
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(null);
  const sugerenciasRef = useRef();
  const timerRef = useRef(null);

  const [validando, setValidando] = useState(false);
  const [datosApi, setDatosApi] = useState(null);
  const [validado, setValidado] = useState(false);
  const [modal, setModal] = useState({ open: false, type: "", msg: "", data: null });
  const [error, setError] = useState("");
  // Errores de campo
  const [erroresCampo, setErroresCampo] = useState({});

  const userId = getUserId();
  const FACTILIZA_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOTk0NCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6ImNvbnN1bHRvciJ9.SdDFGWNLk8Z7hcFCE4_pv_YLCepRcrQlXfF2FRRSTmM";

  const marcasFiltradas = marca
    ? marcas.filter((m) => m.toLowerCase().startsWith(marca.toLowerCase())).slice(0, 10)
    : [];

  // 🔹 NUEVO: cargar servicios y horarios fijos desde backend
  useEffect(() => {
    const fetchCatalogos = async () => {
      setLoadingCatalogos(true);
      setErrorCatalogos("");
      try {
        const [servRes, horRes] = await Promise.all([
          fetch(`${API_BASE_URL}/servicios`),
          fetch(`${API_BASE_URL}/newhorarios`),
        ]);

        if (!servRes.ok || !horRes.ok) {
          throw new Error("No se pudieron cargar servicios u horarios.");
        }

        const serviciosData = await servRes.json(); // [{id,nombre,habilitado}]
        const horariosData = await horRes.json(); // [{id,hora,habilitado}]

        setServiciosApi(serviciosData.filter((s) => s.habilitado));
        setHorariosApi(
          horariosData
            .filter((h) => h.habilitado)
            .sort((a, b) => a.hora.localeCompare(b.hora))
        );
      } catch (err) {
        setErrorCatalogos(err.message);
      } finally {
        setLoadingCatalogos(false);
      }
    };

    fetchCatalogos();
  }, []);

  // Timer de 3 minutos
  useEffect(() => {
    if (horarioSeleccionado) {
      const inicioTimer = Date.now();
      setTiempoRestante(TIEMPO_LIMITE_MS);
      timerRef.current = setInterval(() => {
        const transcurrido = Date.now() - inicioTimer;
        const restante = TIEMPO_LIMITE_MS - transcurrido;
        if (restante <= 0) {
          limpiarFormulario();
          setError("⏱️ Se agotó el tiempo de reserva. Por favor, inicia de nuevo.");
          setTimeout(() => setError(""), 5000);
          clearInterval(timerRef.current);
        } else {
          setTiempoRestante(restante);
        }
      }, 1000);
      return () => clearInterval(timerRef.current);
    } else {
      setTiempoRestante(null);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [horarioSeleccionado]);

  // Consultar estado de horarios (LIBRE / OCUPADO / EN_PROCESO) para una fecha
  useEffect(() => {
    let interval;
    const fetchHorarios = async () => {
      if (!fechaCita) return;
      setLoadingHorarios(true);
      try {
        const res = await fetch(`${API_BASE_URL}/horarios?fecha=${fechaCita}`);
        if (res.ok) {
          const data = await res.json();
          // Se asume data es un mapa { "09:00": "LIBRE", ... }
          setEstadoHorarios(data);
        }
      } catch (err) {
        console.error("Error al cargar horarios:", err);
      } finally {
        setLoadingHorarios(false);
      }
    };
    if (fechaCita) {
      fetchHorarios();
      interval = setInterval(fetchHorarios, 3000);
    }
    return () => clearInterval(interval);
  }, [fechaCita]);

  // Cerrar sugerencias de marca al click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (sugerenciasRef.current && !sugerenciasRef.current.contains(event.target)) {
        setShowSugerencias(false);
      }
    }
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validarCampos = (servicioValue) => {
    let errores = {};
    const currentYear = new Date().getFullYear();

    if (!marca.trim()) {
      errores.marca = "La marca del vehículo es obligatoria.";
    }

    if (!modelo.trim()) {
      errores.modelo = "El modelo del vehículo es obligatorio.";
    }

    const anioNum = parseInt(anio);
    if (!anio.trim()) {
      errores.anio = "El año del vehículo es obligatorio.";
    } else if (isNaN(anioNum) || anioNum < 1900 || anioNum > currentYear + 1) {
      errores.anio = "El año ingresado no es válido.";
    }

    if (!placa.trim()) {
      errores.placa = "La placa es obligatoria.";
    } else if (!PLACA_REGEX.test(placa.toUpperCase())) {
      errores.placa =
        "La placa debe tener entre 6 y 10 caracteres (letras mayúsculas, números o guiones).";
    }

    if (nota.length > MAX_NOTA_CHARS) {
      errores.nota = `La nota del vehículo no puede exceder los ${MAX_NOTA_CHARS} caracteres.`;
    }

    if (!servicioValue) {
      errores.servicio = "Seleccionar un servicio es obligatorio.";
    }

    if (!fechaCita) {
      errores.fechaCita = "La fecha de la cita es obligatoria.";
    }

    if (!horarioSeleccionado) {
      errores.horarioSeleccionado = "Seleccionar un horario es obligatorio.";
    }

    setErroresCampo(errores);
    return Object.keys(errores).length === 0;
  };

  const handleMarcaChange = (e) => {
    setMarca(e.target.value);
    setShowSugerencias(true);
    setErroresCampo((prev) => ({ ...prev, marca: undefined }));
  };

  const handleMarcaSelect = (m) => {
    setMarca(m);
    cargarModelos(m);
    setShowSugerencias(false);
    setErroresCampo((prev) => ({ ...prev, marca: undefined }));
  };

  const handleModeloChange = (e) => {
    setModelo(e.target.value);
    setErroresCampo((prev) => ({ ...prev, modelo: undefined }));
  };

  const handleAnioChange = (e) => {
    setAnio(e.target.value);
    setErroresCampo((prev) => ({ ...prev, anio: undefined }));
  };

  const handlePlacaChange = (e) => {
    setPlaca(e.target.value.replace(/-/g, "").toUpperCase());
    setErroresCampo((prev) => ({ ...prev, placa: undefined }));
  };

  const handleNotaChange = (e) => {
    setNota(e.target.value);
    if (e.target.value.length <= MAX_NOTA_CHARS) {
      setErroresCampo((prev) => ({ ...prev, nota: undefined }));
    }
  };

  const handleFechaChange = (e) => {
    setFechaCita(e.target.value);
    setHorarioSeleccionado("");
    setErroresCampo((prev) => ({
      ...prev,
      fechaCita: undefined,
      horarioSeleccionado: undefined,
    }));
  };

  const seleccionarHorario = async (hora) => {
    if (estadoHorarios[hora] !== "LIBRE") return;
    try {
      const res = await fetch(`${API_BASE_URL}/horarios/lock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fecha: fechaCita, hora }),
      });
      if (res.ok) {
        setHorarioSeleccionado(hora);
        setErroresCampo((prev) => ({ ...prev, horarioSeleccionado: undefined }));
      } else {
        setError("Horario no disponible, selecciona otro.");
        setTimeout(() => setError(""), 3000);
      }
    } catch {
      setError("Error al seleccionar horario.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const limpiarFormulario = () => {
    setMarca("");
    setModelo("");
    setAnio("");
    setPlaca("");
    setNota("");
    setDatosApi(null);
    setValidado(false);
    setFechaCita("");
    setHorarioSeleccionado("");
    setTiempoRestante(null);
    setErroresCampo({});
    if (document.getElementById("servicio")) document.getElementById("servicio").value = "";
    if (document.getElementById("notaCita")) document.getElementById("notaCita").value = "";
  };

  const ModalPopup = ({ open, type, msg, children, onClose }) => {
    if (!open) return null;
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className={`modal-popup ${type}`} onClick={(e) => e.stopPropagation()}>
          <div className="modal-icon">
            {type === "success" ? (
              <span className="big-check">✔️</span>
            ) : type === "error" ? (
              <span className="big-cross">✖️</span>
            ) : (
              <span className="big-info">ℹ️</span>
            )}
          </div>
          <div className="modal-content">
            {msg}
            {children}
          </div>
          <button className="modal-btn-close" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    );
  };

  const validarDatosVehiculo = async () => {
    setError("");
    setValidando(true);
    setValidado(false);
    setDatosApi(null);

    if (!placa || placa.trim().length < 6 || !marca || !modelo) {
      setValidando(false);
      return false;
    }

    try {
      const response = await fetch(
        `https://api.factiliza.com/v1/placa/info/${placa.toUpperCase()}`,
        {
          headers: {
            Authorization: `Bearer ${FACTILIZA_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.status === 200 && data.data) {
        const info = data.data;
        const coincide =
          info.placa?.toUpperCase() === placa.toUpperCase() &&
          info.marca?.toLowerCase().includes(marca.toLowerCase()) &&
          info.modelo?.toLowerCase().includes(modelo.toLowerCase());
        if (coincide) {
          setValidado(true);
          setDatosApi(info);
          setError("");
          setModal({
            open: true,
            type: "success",
            msg: "Aprobado: Datos validados correctamente con la API.",
            data: info,
          });
          setValidando(false);
          return true;
        } else {
          setModal({
            open: true,
            type: "error",
            msg: "Los datos ingresados no coinciden con los obtenidos de la API.",
          });
          setValidando(false);
          return false;
        }
      } else {
        setModal({
          open: true,
          type: "error",
          msg: "No se encontró información de esta placa en la API.",
        });
        setValidando(false);
        return false;
      }
    } catch (err) {
      setModal({
        open: true,
        type: "error",
        msg: "Error consultando la API de Factiliza. Vuelve a intentar.",
      });
      setValidando(false);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const servicio = document.getElementById("servicio").value;
    const notaCita = document.getElementById("notaCita").value;

    if (!validarCampos(servicio)) {
      setError("Corrija los errores en los campos antes de continuar.");
      return;
    }

    const validacionCorrecta = await validarDatosVehiculo();
    if (!validacionCorrecta) return;

    const token = getToken();
    if (!token) {
      setError("⚠️ Sesión expirada. Por favor inicia sesión nuevamente.");
      return;
    }
    try {
      const automovilData = {
        marca: marca.trim(),
        modelo: modelo.trim(),
        anio: parseInt(anio) || new Date().getFullYear(),
        placa: placa.trim().toUpperCase(),
        nota: (nota || notaCita || "").trim().substring(0, MAX_NOTA_CHARS),
      };

      const autoResponse = await fetch(`${API_BASE_URL}}/automoviles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(automovilData),
      });
      if (!autoResponse.ok) throw new Error(await autoResponse.text());
      const automovilRegistrado = await autoResponse.json();

      const fechaISO = `${fechaCita}T${horarioSeleccionado}:00`;
      const reservaData = {
        estado: "PENDIENTE",
        fecha: fechaISO,
        servicio: servicio.trim(),
        userId: parseInt(userId),
        automovilId: automovilRegistrado.id,
      };

      const reservaResponse = await fetch(`${API_BASE_URL}/reservas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservaData),
      });
      if (!reservaResponse.ok) throw new Error(await reservaResponse.text());

      setModal({ open: true, type: "success", msg: "¡Cita registrada exitosamente!" });
      limpiarFormulario();
    } catch (err) {
      setModal({ open: true, type: "error", msg: err.message });
    }
  };

  const formatearTiempo = (ms) => {
    const minutos = Math.floor(ms / 60000);
    const segundos = Math.floor((ms % 60000) / 1000);
    return `${minutos}:${segundos.toString().padStart(2, "0")}`;
  };

  return (
    <div className="nueva-cita-main">
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');

      .nueva-cita-main {
        min-height: 100vh;
        background: #eef4f5;
        font-family: 'Inter', sans-serif;
        padding: 24px 0 40px 0;
      }

      .nc-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 800px;
        margin: 0 auto 26px auto;
        padding: 0 18px;
      }
      .nc-header h2 {
        font-weight: 900;
        font-size: 1.7rem;
        color: #1a9ca9;
        margin-bottom: 2px;
      }
      .nc-header p {
        color: #464747;
        font-size: 1rem;
        margin: 0;
      }
      .nc-btn-back {
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
      .nc-btn-back:hover {
        opacity: 0.85;
        transform: translateY(-2px);
        box-shadow: 0 5px 20px #1a9ca9b3;
      }

      .nc-card {
        background: white;
        border-radius: 13px;
        border: 2px solid #f0f4fa;
        box-shadow: 0 2px 14px #e8eef2;
        padding: 28px 24px;
        max-width: 800px;
        margin: 0 auto;
      }

      .nc-section-title {
        font-size: 1.15rem;
        font-weight: 800;
        color: #1a9ca9;
        margin: 20px 0 14px 0;
        padding-bottom: 8px;
        border-bottom: 2px solid #e3e9f0;
      }
      .nc-section-title:first-of-type {
        margin-top: 0;
      }

      .nc-alert {
        max-width: 100%;
        background: #f7fcfd;
        border: 1.1px solid #c3dbe2;
        border-radius: 10px;
        padding: 14px 18px;
        font-weight: 700;
        color: #187887;
        display: flex;
        gap: 10px;
        align-items: center;
        font-size: 0.95rem;
        margin-bottom: 16px;
      }
      .nc-alert-error {
        background: #fee;
        color: #bd2d38;
        border-color: #fcc;
      }
      .nc-alert-timer {
        background: #fff8e6;
        color: #b15e13;
        border-color: #f9dcc4;
      }

      .nc-form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
      }

      .nc-form-group {
        display: flex;
        flex-direction: column;
        position: relative;
      }
      .nc-form-group.full-width {
        grid-column: 1 / -1;
      }

      .nc-label {
        font-size: 0.9rem;
        font-weight: 700;
        color: #46555f;
        margin-bottom: 6px;
      }

      .nc-input, .nc-select, .nc-textarea {
        padding: 12px 14px;
        border: 2px solid #e3e9f0;
        border-radius: 10px;
        font-size: 1rem;
        font-family: inherit;
        transition: all 0.2s;
        background: #f9fbfc;
      }
      .nc-input:focus, .nc-select:focus, .nc-textarea:focus {
        outline: none;
        border-color: #1a9ca9;
        background: white;
        box-shadow: 0 0 0 3px #1a9ca920;
      }

      .nc-input.error, .nc-select.error, .nc-textarea.error {
        border-color: #bd2d38;
      }
      .nc-input.error:focus, .nc-select.error:focus, .nc-textarea.error:focus {
        box-shadow: 0 0 0 3px #bd2d3820;
      }

      .nc-error-msg {
        color: #bd2d38;
        font-size: 0.8rem;
        font-weight: 600;
        margin-top: 5px;
      }

      .nc-textarea {
        resize: vertical;
        min-height: 70px;
      }

      .nc-sugerencias {
        list-style: none;
        margin: 0;
        padding: 6px;
        background: white;
        border-radius: 10px;
        border: 2px solid #e3e9f0;
        box-shadow: 0 4px 16px #168a9937;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 100;
        max-height: 200px;
        overflow-y: auto;
      }
      .nc-sugerencias li {
        padding: 10px 14px;
        cursor: pointer;
        border-radius: 6px;
        transition: background 0.15s;
      }
      .nc-sugerencias li:hover {
        background: #f0f8fc;
      }

      .nc-horarios {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 8px;
      }
      .nc-hora-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 14px 20px;
        border: 2px solid #e3e9f0;
        border-radius: 12px;
        background: #f9fbfc;
        cursor: pointer;
        transition: all 0.2s;
        min-width: 100px;
      }
      .nc-hora-btn:hover:not(.disabled):not(.selected) {
        border-color: #1a9ca9;
        background: #f0f8fc;
      }
      .nc-hora-btn.selected {
        background: linear-gradient(120deg, #1a9ca9 60%, #15b2b8);
        border-color: #1a9ca9;
        color: white;
        box-shadow: 0 4px 15px #1a9ca950;
      }
      .nc-hora-btn.disabled {
        background: #f0f0f0;
        color: #999;
        cursor: not-allowed;
        opacity: 0.7;
      }
      .nc-hora-btn span {
        font-size: 1.3rem;
        font-weight: 800;
      }
      .nc-hora-btn small {
        font-size: 0.75rem;
        margin-top: 4px;
        font-weight: 600;
      }

      .nc-horarios.error {
        border: 2px solid #bd2d38;
        padding: 10px;
        border-radius: 12px;
      }

      .nc-btn-submit {
        background: linear-gradient(120deg, #1a9ca9 60%, #15b2b8);
        color: white;
        padding: 14px 40px;
        border: none;
        border-radius: 12px;
        font-weight: 800;
        font-size: 1.1rem;
        cursor: pointer;
        box-shadow: 0 4px 20px #1a9ca940;
        transition: all 0.2s;
        margin-top: 24px;
        width: 100%;
      }
      .nc-btn-submit:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 25px #1a9ca960;
      }

      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 998;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(23,34,50,0.4);
      }
      .modal-popup {
        background: white;
        padding: 38px 30px 28px 30px;
        border-radius: 16px;
        max-width: 340px;
        text-align: center;
        box-shadow: 0 8px 40px #24b6d644;
        animation: slideZoomPopUp .38s cubic-bezier(.38,1.32,.6,1) both;
        z-index: 1000;
      }
      .modal-popup.success .big-check { color: #13ab68; }
      .modal-popup.error .big-cross { color: #e14343; }
      .modal-popup .big-check, .modal-popup .big-cross, .modal-popup .big-info {
        font-size: 3rem;
        display: block;
        margin-bottom: 13px;
        animation: popInCheck .43s cubic-bezier(.41,1.03,.5,.98);
      }
      @keyframes popInCheck {
        0% { opacity: 0; transform: scale(.5); }
        90% { transform: scale(1.2); }
        100% { opacity: 1; transform: scale(1); }
      }
      @keyframes slideZoomPopUp {
        from { transform: translateY(-80px) scale(0.7); opacity: .5; }
        to { transform: none; opacity: 1; }
      }
      .modal-content {
        margin-top: 3px;
        margin-bottom: 14px;
        font-size: 1.07rem;
        font-weight: 700;
        color: #137099;
      }
      .modal-btn-close {
        margin-top: 12px;
        padding: 10px 34px;
        background: #1a9ca9;
        border: none;
        border-radius: 8px;
        color: white;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        transition: .17s;
      }
      .modal-btn-close:hover {
        background: #13ab68;
      }

      @media (max-width: 600px) {
        .nc-header { flex-direction: column; gap: 12px; text-align: center; }
        .nc-card { margin: 0 12px; padding: 20px 16px; }
        .nc-form-grid { grid-template-columns: 1fr; }
        .nc-horarios { justify-content: center; }
      }
      `}</style>

      {modal.open && (
        <ModalPopup
          open={modal.open}
          type={modal.type}
          msg={modal.msg}
          onClose={() => setModal({ ...modal, open: false })}
        >
          {modal.data && (
            <div style={{ fontSize: "1rem", marginTop: "9px" }}>
              Marca: <strong>{modal.data.marca}</strong>
              <br />
              Modelo: <strong>{modal.data.modelo}</strong>
              <br />
              Placa: <strong>{modal.data.placa}</strong>
            </div>
          )}
        </ModalPopup>
      )}

      <div className="nc-header">
        <div>
          <h2>📅 Nueva Cita</h2>
          <p>Completa los datos para agendar tu cita.</p>
        </div>
        <a href="/panel-cita/mis-citas" className="nc-btn-back">
          ← Mis Citas
        </a>
      </div>

      <div className="nc-card">
        {error && <div className="nc-alert nc-alert-error">❌ {error}</div>}
        {errorCatalogos && (
          <div className="nc-alert nc-alert-error">❌ {errorCatalogos}</div>
        )}
        {(loadingCatalogos || loadingHorarios) && (
          <div className="nc-alert">⏳ Cargando servicios y horarios disponibles...</div>
        )}
        {tiempoRestante !== null && (
          <div className="nc-alert nc-alert-timer">
            ⏳ Tiempo restante para completar:{" "}
            <strong>{formatearTiempo(tiempoRestante)}</strong>
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" noValidate>
          <div className="nc-section-title">🚗 Datos del vehículo</div>

          <div className="nc-form-grid">
            <div className="nc-form-group" ref={sugerenciasRef}>
              <label className="nc-label">Marca</label>
              <input
                className={`nc-input ${erroresCampo.marca ? "error" : ""}`}
                type="text"
                required
                autoComplete="off"
                value={marca}
                onChange={handleMarcaChange}
                onFocus={() => setShowSugerencias(true)}
                placeholder="Ej: Toyota"
              />
              {showSugerencias && marca && marcasFiltradas.length > 0 && (
                <ul className="nc-sugerencias">
                  {marcasFiltradas.map((m) => (
                    <li key={m} onMouseDown={() => handleMarcaSelect(m)}>
                      {m}
                    </li>
                  ))}
                </ul>
              )}
              {erroresCampo.marca && (
                <div className="nc-error-msg">{erroresCampo.marca}</div>
              )}
            </div>

            <div className="nc-form-group">
              <label className="nc-label">Modelo</label>
              <input
                className={`nc-input ${erroresCampo.modelo ? "error" : ""}`}
                type="text"
                required
                value={modelo}
                onChange={handleModeloChange}
                placeholder="Ej: Corolla"
              />
              {erroresCampo.modelo && (
                <div className="nc-error-msg">{erroresCampo.modelo}</div>
              )}
            </div>

            <div className="nc-form-group">
              <label className="nc-label">Año</label>
              <input
                className={`nc-input ${erroresCampo.anio ? "error" : ""}`}
                type="number"
                required
                min="1900"
                max={new Date().getFullYear() + 1}
                value={anio}
                onChange={handleAnioChange}
                placeholder="Ej: 2022"
              />
              {erroresCampo.anio && (
                <div className="nc-error-msg">{erroresCampo.anio}</div>
              )}
            </div>

            <div className="nc-form-group">
              <label className="nc-label">Placa</label>
              <input
                className={`nc-input ${erroresCampo.placa ? "error" : ""}`}
                type="text"
                required
                value={placa}
                maxLength={10}
                onChange={handlePlacaChange}
                disabled={validando}
                placeholder="Ej: ABC123"
              />
              {erroresCampo.placa && (
                <div className="nc-error-msg">{erroresCampo.placa}</div>
              )}
            </div>

            <div className="nc-form-group full-width">
              <label className="nc-label">Nota del vehículo (opcional)</label>
              <textarea
                className={`nc-textarea ${erroresCampo.nota ? "error" : ""}`}
                rows={2}
                value={nota}
                onChange={handleNotaChange}
                maxLength={MAX_NOTA_CHARS}
                placeholder="Detalles adicionales del vehículo..."
              />
              {erroresCampo.nota && (
                <div className="nc-error-msg">{erroresCampo.nota}</div>
              )}
            </div>
          </div>

          <div className="nc-section-title">📋 Detalles de la cita</div>

          <div className="nc-form-grid">
            <div className="nc-form-group">
              <label className="nc-label">Servicio</label>
              <select
                id="servicio"
                className={`nc-select ${erroresCampo.servicio ? "error" : ""}`}
                required
                onChange={(e) => {
                  if (e.target.value)
                    setErroresCampo((prev) => ({ ...prev, servicio: undefined }));
                }}
              >
                <option value="">Seleccione el servicio</option>
                {serviciosApi.map((serv) => (
                  <option key={serv.id} value={serv.nombre}>
                    {serv.nombre}
                  </option>
                ))}
              </select>
              {erroresCampo.servicio && (
                <div className="nc-error-msg">{erroresCampo.servicio}</div>
              )}
            </div>

            <div className="nc-form-group">
              <label className="nc-label">Fecha</label>
              <input
                type="date"
                className={`nc-input ${erroresCampo.fechaCita ? "error" : ""}`}
                required
                min={new Date().toISOString().split("T")[0]}
                value={fechaCita}
                onChange={handleFechaChange}
              />
              {erroresCampo.fechaCita && (
                <div className="nc-error-msg">{erroresCampo.fechaCita}</div>
              )}
            </div>
          </div>

          {fechaCita && (
            <div
              className="nc-form-group full-width"
              style={{ marginTop: "16px" }}
            >
              <label className="nc-label">Selecciona horario</label>
              <div
                className={`nc-horarios ${
                  erroresCampo.horarioSeleccionado ? "error" : ""
                }`}
              >
                {horariosApi.map((hor) => {
                  const hora = hor.hora; // "HH:MM"
                  const estado = estadoHorarios[hora] || "LIBRE";
                  const isSelected = horarioSeleccionado === hora;
                  let cls = "nc-hora-btn";
                  if (isSelected) cls += " selected";
                  if (estado !== "LIBRE" && !isSelected) cls += " disabled";
                  return (
                    <button
                      key={hor.id}
                      type="button"
                      className={cls}
                      disabled={estado !== "LIBRE" && !isSelected}
                      onClick={() => seleccionarHorario(hora)}
                    >
                      <span>{hora}</span>
                      <small>
                        {estado === "LIBRE" && !isSelected && "Disponible"}
                        {isSelected && "✓ Seleccionado"}
                        {estado === "EN_PROCESO" && !isSelected && "En proceso"}
                        {estado === "OCUPADO" && "Ocupado"}
                      </small>
                    </button>
                  );
                })}
              </div>
              {erroresCampo.horarioSeleccionado && (
                <div className="nc-error-msg">
                  {erroresCampo.horarioSeleccionado}
                </div>
              )}
            </div>
          )}

          <div className="nc-form-group full-width" style={{ marginTop: "16px" }}>
            <label className="nc-label">Notas adicionales</label>
            <textarea
              id="notaCita"
              className="nc-textarea"
              rows={3}
              maxLength={500}
              placeholder="Información adicional para tu cita..."
            />
          </div>

          <button type="submit" className="nc-btn-submit">
            💾 Confirmar Cita
          </button>
        </form>
      </div>
    </div>
  );
};
