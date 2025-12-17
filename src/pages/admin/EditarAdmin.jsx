import React, { useState, useEffect } from 'react';
import { RefreshCcw, Plus, Trash2, Clock, Wrench, ToggleRight, ToggleLeft } from 'lucide-react';
import { API_BASE_URL } from '../../utils/constans';

const API_URL = API_BASE_URL;

export const EditarAdmin = () => {
    const [servicios, setServicios] = useState([]);
    const [nuevoServicio, setNuevoServicio] = useState('');
    const [horariosFijos, setHorariosFijos] = useState([]);
    const [nuevoHorario, setNuevoHorario] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedHour, setSelectedHour] = useState('09');
    const [selectedMinute, setSelectedMinute] = useState('00');

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [serviciosRes, horariosRes] = await Promise.all([
                fetch(`${API_URL}/servicios`), 
                fetch(`${API_URL}/newhorarios`)
            ]);

            if (!serviciosRes.ok || !horariosRes.ok) {
                throw new Error("Error al cargar los catálogos. Verifique que el Backend esté corriendo y que las rutas /api/servicios y /api/horarios-fijos existan.");
            }

            const serviciosData = await serviciosRes.json();
            const horariosData = await horariosRes.json();

            setServicios(serviciosData);
            setHorariosFijos(horariosData.sort((a, b) => a.hora.localeCompare(b.hora)));

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddHorarioFijo = async () => {
        if (!nuevoHorario || nuevoHorario.trim() === '') {
            setError("La hora no puede estar vacía.");
            return;
        }
        
        try {
            const res = await fetch(`${API_URL}/horarios-fijos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hora: nuevoHorario, habilitado: true }), 
            });
            
            if (res.ok) {
                const data = await res.json();
                setHorariosFijos(prev => [...prev, data].sort((a, b) => a.hora.localeCompare(b.hora)));
                setNuevoHorario('');
                setError(null);
            } else {
                const errorData = await res.json();
                setError(errorData.message || "Error al añadir el horario. ¿Ya existe o el formato es incorrecto?");
            }
        } catch (err) { setError("Error de conexión al añadir horario."); }
    };

    const handleDeleteHorarioFijo = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este horario?")) return;
        
        try {
            const res = await fetch(`${API_URL}/horarios-fijos/${id}`, {
                method: 'DELETE',
            });
            
            if (res.ok) {
                setHorariosFijos(prev => prev.filter(h => h.id !== id));
                setError(null);
            } else {
                setError("Error al eliminar el horario. Verifique permisos.");
            }
        } catch (err) { setError("Error de conexión al eliminar horario."); }
    };

    const handleAddServicio = async () => {
        if (!nuevoServicio || nuevoServicio.trim() === '') {
            setError("El nombre del servicio no puede estar vacío.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/servicios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    nombre: nuevoServicio, 
                    descripcion: "Descripción por defecto",
                    precio: 0.0,
                    activo: true,
                    habilitado: true 
                }), 
            });
            
            if (res.ok) {
                const data = await res.json();
                setServicios(prev => [...prev, data]);
                setNuevoServicio('');
                setError(null);
            } else {
                const errorData = await res.json();
                setError(errorData.message || "Error al añadir el servicio. ¿Ya existe?");
            }
        } catch (err) { setError("Error de conexión al añadir servicio."); }
    };

    const handleDeleteServicio = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este servicio?")) return;
        
        try {
            const res = await fetch(`${API_URL}/servicios/${id}`, {
                method: 'DELETE',
            });
            
            if (res.ok) {
                setServicios(prev => prev.filter(s => s.id !== id));
                setError(null);
            } else {
                setError("Error al eliminar el servicio. Verifique permisos.");
            }
        } catch (err) { setError("Error de conexión al eliminar servicio."); }
    };

    const handleToggleServicio = async (servicioId, currentState) => {
        try {
            const res = await fetch(`${API_URL}/servicios/${servicioId}/toggle`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ habilitado: !currentState }),
            });
            if (res.ok) {
                setServicios(servicios.map(s => 
                    s.id === servicioId ? { ...s, habilitado: !currentState } : s
                ));
                setError(null);
            } else {
                setError("Error al cambiar el estado del servicio.");
            }
        } catch (err) { setError("Error de conexión al cambiar estado."); }
    };

    const handleToggleHorario = async (horarioId, currentState) => {
        try {
            const res = await fetch(`${API_URL}/horarios-fijos/${horarioId}/toggle`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ habilitado: !currentState }),
            });
            if (res.ok) {
                setHorariosFijos(horariosFijos.map(h => 
                    h.id === horarioId ? { ...h, habilitado: !currentState } : h
                ));
                setError(null);
            } else {
                setError("Error al cambiar el estado del horario.");
            }
        } catch (err) { setError("Error de conexión al cambiar estado."); }
    };

    const handleTimeSelect = () => {
        const timeString = `${selectedHour}:${selectedMinute}`;
        setNuevoHorario(timeString);
        setShowTimePicker(false);
    };

    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    if (loading) return <div className="loading">Cargando datos de administración...</div>;

    return (
        <div className="admin-edit-main">
            <h2>Gestión de Catálogos de Citas</h2>
            
            <button onClick={fetchData} className="refresh-btn">
                <RefreshCcw size={16} /> Recargar Datos
            </button>
            
            {error && <div className="admin-alert-error">❌ {error}</div>}

            <div className="admin-section">
                <h3><Clock size={20} style={{verticalAlign: 'middle', marginRight: '5px'}} /> Horarios Fijos Disponibles</h3>
                <p>Define las horas exactas. Usa el botón de alternar para activar/desactivar el horario para los usuarios.</p>
                
                <div className="admin-input-group">
                    <div className="time-picker-wrapper">
                        <input
                            type="text"
                            value={nuevoHorario}
                            placeholder="Selecciona una hora"
                            readOnly
                            onClick={() => setShowTimePicker(!showTimePicker)}
                            className="time-input"
                        />
                        <Clock 
                            size={18} 
                            className="clock-icon"
                            onClick={() => setShowTimePicker(!showTimePicker)}
                        />
                        
                        {showTimePicker && (
                            <div className="time-picker-dropdown">
                                <div className="time-picker-header">
                                    <span>Selecciona la hora</span>
                                    <button 
                                        onClick={() => setShowTimePicker(false)}
                                        className="close-picker"
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className="time-picker-body">
                                    <div className="time-column">
                                        <div className="column-label">Hora</div>
                                        <div className="time-options">
                                            {hours.map(hour => (
                                                <div
                                                    key={hour}
                                                    className={`time-option ${selectedHour === hour ? 'selected' : ''}`}
                                                    onClick={() => setSelectedHour(hour)}
                                                >
                                                    {hour}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="time-separator">:</div>
                                    <div className="time-column">
                                        <div className="column-label">Minutos</div>
                                        <div className="time-options">
                                            {minutes.map(minute => (
                                                <div
                                                    key={minute}
                                                    className={`time-option ${selectedMinute === minute ? 'selected' : ''}`}
                                                    onClick={() => setSelectedMinute(minute)}
                                                >
                                                    {minute}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="time-picker-footer">
                                    <button onClick={handleTimeSelect} className="confirm-time-btn">
                                        Confirmar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <button onClick={handleAddHorarioFijo} className="add-btn">
                        <Plus size={18} /> Añadir Horario
                    </button>
                </div>

                <div className="admin-list-container">
                    {horariosFijos.length === 0 ? (
                         <p style={{color: '#666'}}>No hay horarios fijos registrados.</p>
                    ) : (
                        horariosFijos.map((h) => (
                            <div key={h.id} className={`admin-item ${!h.habilitado ? 'disabled-item' : ''}`}>
                                <span>{h.hora}</span>
                                
                                <button 
                                    onClick={() => handleToggleHorario(h.id, h.habilitado)} 
                                    className={`toggle-btn ${h.habilitado ? 'active' : ''}`}
                                >
                                    {h.habilitado ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                    {h.habilitado ? 'Habilitado' : 'Deshabilitado'}
                                </button>
                                
                                <button onClick={() => handleDeleteHorarioFijo(h.id)} className="delete-btn">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="admin-section">
                <h3><Wrench size={20} style={{verticalAlign: 'middle', marginRight: '5px'}} /> Catálogo de Servicios</h3>
                <p>Gestiona la lista de servicios. Usa el botón de alternar para ocultar/mostrar un servicio al cliente.</p>

                <div className="admin-input-group">
                    <input
                        type="text"
                        placeholder="Nombre del nuevo servicio"
                        value={nuevoServicio}
                        onChange={(e) => setNuevoServicio(e.target.value)}
                        maxLength={100}
                    />
                    <button onClick={handleAddServicio} className="add-btn">
                        <Plus size={18} /> Añadir Servicio
                    </button>
                </div>

                <div className="admin-list-container">
                    {servicios.length === 0 ? (
                        <p style={{color: '#666'}}>No hay servicios registrados.</p>
                    ) : (
                        servicios.map((s) => (
                            <div key={s.id} className={`admin-item ${!s.habilitado ? 'disabled-item' : ''}`}>
                                <span>{s.nombre}</span>
                                
                                <button 
                                    onClick={() => handleToggleServicio(s.id, s.habilitado)} 
                                    className={`toggle-btn ${s.habilitado ? 'active' : ''}`}
                                >
                                    {s.habilitado ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                    {s.habilitado ? 'Habilitado' : 'Deshabilitado'}
                                </button>
                                
                                <button onClick={() => handleDeleteServicio(s.id)} className="delete-btn">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
            
            <style jsx>{`
                .admin-edit-main { 
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                .loading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    font-size: 1.2rem;
                    color: #1a9ca9;
                }
                
                .admin-edit-main h2 { 
                    color: #1a9ca9;
                    border-bottom: 3px solid #e3e9f0;
                    padding-bottom: 10px;
                    margin-bottom: 25px;
                    font-size: 40px;
                    font-weight: 700;
                }
                
                .admin-section { 
                    margin-top: 30px;
                    padding: 20px;
                    background: #fff;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                }
                
                .admin-section h3 { 
                    color: #46555f;
                    font-size: 1.2rem;
                    margin-bottom: 15px;
                }
                
                .admin-section p { 
                    color: #666;
                    font-size: 0.95rem;
                    margin-bottom: 15px;
                }

                .admin-alert-error { 
                    background: #fee;
                    color: #bd2d38;
                    border: 1px solid #fcc;
                    border-radius: 8px;
                    padding: 12px 15px;
                    font-weight: 600;
                    margin-bottom: 20px;
                }

                .admin-input-group { 
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                    align-items: center;
                }
                
                .admin-input-group input { 
                    padding: 10px 12px;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    flex-grow: 1;
                    max-width: 300px;
                    font-size: 14px;
                }
                
                .time-picker-wrapper {
                    position: relative;
                    flex-grow: 1;
                    max-width: 300px;
                }
                
                .time-input {
                    width: 100%;
                    padding: 10px 40px 10px 12px;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    font-size: 14px;
                    cursor: pointer;
                    background: white;
                }
                
                .time-input:focus {
                    outline: none;
                    border-color: #1a9ca9;
                    box-shadow: 0 0 0 3px rgba(26, 156, 169, 0.1);
                }
                
                .clock-icon {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #1a9ca9;
                    cursor: pointer;
                }
                
                .time-picker-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    margin-top: 5px;
                    background: white;
                    border: 1px solid #e3e9f0;
                    border-radius: 8px;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                    z-index: 1000;
                    width: 280px;
                }
                
                .time-picker-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 16px;
                    border-bottom: 1px solid #e3e9f0;
                    background: #f9fbfc;
                    border-radius: 8px 8px 0 0;
                }
                
                .time-picker-header span {
                    font-weight: 600;
                    color: #333;
                    font-size: 14px;
                }
                
                .close-picker {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    transition: background 0.2s;
                }
                
                .close-picker:hover {
                    background: #e3e9f0;
                }
                
                .time-picker-body {
                    display: flex;
                    align-items: stretch;
                    padding: 10px;
                    gap: 5px;
                }
                
                .time-column {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                
                .column-label {
                    text-align: center;
                    font-weight: 600;
                    color: #46555f;
                    padding: 8px;
                    font-size: 13px;
                    border-bottom: 1px solid #e3e9f0;
                    margin-bottom: 5px;
                }
                
                .time-options {
                    height: 200px;
                    overflow-y: auto;
                    padding: 5px;
                }
                
                .time-options::-webkit-scrollbar {
                    width: 6px;
                }
                
                .time-options::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }
                
                .time-options::-webkit-scrollbar-thumb {
                    background: #1a9ca9;
                    border-radius: 3px;
                }
                
                .time-option {
                    padding: 8px;
                    text-align: center;
                    cursor: pointer;
                    border-radius: 4px;
                    margin-bottom: 2px;
                    transition: all 0.2s;
                    font-size: 14px;
                }
                
                .time-option:hover {
                    background: #f0f8f9;
                }
                
                .time-option.selected {
                    background: #1a9ca9;
                    color: white;
                    font-weight: 600;
                }
                
                .time-separator {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    font-weight: 600;
                    color: #1a9ca9;
                    padding-top: 35px;
                }
                
                .time-picker-footer {
                    padding: 12px;
                    border-top: 1px solid #e3e9f0;
                    background: #f9fbfc;
                    border-radius: 0 0 8px 8px;
                }
                
                .confirm-time-btn {
                    width: 100%;
                    background: #1a9ca9;
                    color: white;
                    border: none;
                    padding: 10px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                
                .confirm-time-btn:hover {
                    background: #15b2b8;
                }
                
                .admin-input-group button { 
                    padding: 10px 15px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                
                .add-btn { 
                    background: #1a9ca9;
                    color: white;
                    transition: background 0.2s;
                }
                
                .add-btn:hover { 
                    background: #15b2b8;
                }
                
                .refresh-btn { 
                    background: linear-gradient(135deg, #15b2b8, #488dceff);
                    color: #ffffff;
                    padding: 14px 32px;
                    font-size: 16px;
                    font-weight: 600;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
                    transition: all 0.3s ease;
                    margin-bottom: 20px;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .refresh-btn:hover { 
                    background: #15b2b8;
                    transform: translateY(-2px);
                    box-shadow: 0 12px 28px rgba(37, 99, 235, 0.4);
                }

                .admin-list-container { 
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    border: 1px solid #f0f4f7;
                    padding: 15px;
                    border-radius: 8px;
                    background: #f9fbfc;
                }
                
                .admin-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    background: white;
                    border: 1px solid #e3e9f0;
                    border-radius: 8px;
                    padding: 10px 15px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    transition: all 0.2s;
                }
                
                .admin-item:hover {
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                
                .admin-item.disabled-item {
                    opacity: 0.6;
                    background: #f5f5f5;
                }
                
                .admin-item span { 
                    font-weight: 600;
                    color: #333;
                }
                
                .toggle-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    border: 1px solid #e3e9f0;
                    border-radius: 6px;
                    background: #f9fbfc;
                    color: #666;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .toggle-btn.active {
                    background: #e8f5f6;
                    color: #1a9ca9;
                    border-color: #1a9ca9;
                }
                
                .toggle-btn:hover {
                    background: #e3e9f0;
                }
                
                .delete-btn { 
                    background: #f44336;
                    color: white;
                    padding: 6px 10px;
                    border: none;
                    border-radius: 5px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: background 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .delete-btn:hover { 
                    background: #d32f2f;
                }
            `}</style>
        </div>
    );
};