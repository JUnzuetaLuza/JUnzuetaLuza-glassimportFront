import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <motion.footer
            className="main-footer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}

            // 🚀 ESTILO EN LÍNEA: BLANCO SÓLIDO Y SIN FILTRO (Prioridad Máxima)
            style={{
                backgroundColor: '#ffffff',
                backdropFilter: 'none'
            }}
        >
            <div className="footer-container">
                {/* Columna 1: Redes Sociales */}
                <div className="footer-col social-col">
                    <h3 className="footer-title">SÍGUENOS</h3>
                    <div className="social-icons">
                        <a href="#" aria-label="Facebook">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" aria-label="Instagram">
                            <i className="fab fa-instagram"></i>
                        </a>
                    </div>
                </div>

                {/* Columna 2: Contacto */}
                <div className="footer-col contact-col">
                    <h3 className="footer-title">CONTÁCTANOS</h3>
                    <div className="contact-info">
                        <p>
                            <i className="fas fa-phone-alt"></i> 972 771 795 – 998 139 770
                        </p>
                        <p>
                            <i className="fas fa-envelope"></i> ventas@glassimport.net
                        </p>
                        <p className="schedule">
                            <i className="fas fa-calendar-alt"></i> Lunes a Viernes 8:30 - 18:00
                        </p>
                        <p className="schedule">
                            <i className="fas fa-calendar-alt"></i> Sábados 8:45 - 12:45
                        </p>
                    </div>
                </div>

                {/* Columna 3: Ubicación (Mapa) */}
                <div className="footer-col map-col">
                    <h3 className="footer-title">ENCUÉNTRANOS</h3>
                    <div className="map-embed">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.563065636053!2d-77.0560879!3d-12.1524385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105b81a748c9c61%3A0x8670c53c48e8336d!2sAv.%20Del%20Ej%C3%A9rcito%20867%2C%20Miraflores%2015074!5e0!3m2!1ses-419!2spe!4v1678896000000!5m2!1ses-419!2spe"
                            width="100%"
                            height="200"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Ubicación de Glass Import"
                        ></iframe>
                        <div className="address-overlay">
                            Av. del Ejército 867
                            <a href="https://www.google.com/maps/search/?api=1&query=Av.+del+Ejército+867" target="_blank" rel="noopener noreferrer">
                                Ampliar el mapa
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Glass Import. Todos los derechos reservados.</p>
            </div>


            {/* ⚠️ AVISO IMPORTANTE ⚠️
               - Los estilos de diseño estaban causando conflictos al ser internos (<style jsx>).
               - El fondo BLANCO ahora está forzado en la etiqueta motion.footer usando style={}.
               - PARA QUE EL DISEÑO NO SE ROMPA, DEBES MOVER EL SIGUIENTE CSS
                 A UN ARCHIVO GLOBAL (ej: index.css o App.css) o a un archivo CSS dedicado
                 (ej: Footer.css) e importarlo.
            */}
            <style jsx>{`
             .main-footer {
                                               --c1: #1a9ca9;
                                               --c2: #126c75;
                                               --text: #121515;

                                               /* EL FONDO BLANCO YA ESTÁ EN style={{...}} */
                                               box-shadow: 0 -4px 30px rgba(0,0,0,0.05);

                                               color: var(--text); /* Cambia el color del texto a negro */
                                               padding: 40px 20px 0;
                                               font-family: 'Inter', sans-serif;
                                               position: relative;
                                               z-index: 2;
                                           }

                .footer-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 30px;
                    padding-bottom: 30px;
                }

                @media (min-width: 768px) {
                    .footer-container {
                        grid-template-columns: 1fr 1.5fr 1.5fr;
                        gap: 50px;
                    }
                }

                .footer-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin-bottom: 20px;
                    color: var(--c2); /* Color de acento para los títulos */
                }

                /* Columna de Redes Sociales */
                .social-icons {
                    display: flex;
                    gap: 15px;
                }

                .social-icons a {
                    color: var(--text); /* Iconos en color de texto principal */
                    font-size: 1.5rem;
                    transition: color 0.3s;
                }

                .social-icons a:hover {
                    color: var(--c1); /* Color de acento al pasar el ratón */
                }

                /* Columna de Contacto */
                .contact-info p {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    font-size: 0.95rem;
                }

                .contact-info i {
                    color: var(--c1); /* Iconos de contacto en color de acento */
                    margin-right: 10px;
                    width: 20px;
                    text-align: center;
                }

                .schedule i {
                    color: var(--c2); /* Color un poco más oscuro para el horario */
                }

                /* Columna de Mapa */
                .map-embed {
                    position: relative;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                }

                .map-embed iframe {
                    display: block;
                }

                .address-overlay {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: #ffffff;
                    color: var(--text);
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                }

                .address-overlay a {
                    display: block;
                    margin-top: 4px;
                    color: var(--c1);
                    text-decoration: none;
                    font-weight: 400;
                }

                /* Sección de Copyright */
                .footer-bottom {
                    text-align: center;
                    padding: 20px 0;
                    border-top: 1px solid rgba(18, 21, 21, 0.1); /* Línea divisoria suave */
                    margin-top: 20px;
                }

                .footer-bottom p {
                    font-size: 0.85rem;
                    color: var(--text);
                }
            `}</style>
        </motion.footer>
    );
};

export default Footer;