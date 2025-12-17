import React from 'react';
import { motion } from 'framer-motion';

// Adaptamos los datos para el formato de tarjeta de equipo (título/descripción)
const galleryItems = [
    { src: "/img/carrogris.jpeg", mainText: "Protección", subText: "Protección total ante accidentes." },
    { src: "/img/carluna.jpeg", mainText: "Bloqueo UV", subText: "Bloqueo UV al 99%." },
    { src: "/img/lugardos.jpeg", mainText: "Certificación", subText: "Empresa certificada." },
    { src: "/img/demostracion.png", mainText: "Calidad", subText: "La mejor calidad del mercado." },
];

export const HomeGallery = () => (
    <section className="home-gallery-section">
        <motion.h2
          className="gallery-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Calidad y Confianza
        </motion.h2>

        <div className="home-gallery-grid">
            {galleryItems.map((item, i) => (
                <motion.div
                  key={i}
                  className="gallery-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}

                  // 🚀 EFECTO DE AGRANDAMIENTO AL PASAR EL RATÓN (whileHover)
                  whileHover={{
                      scale: 1.05, // Se agranda un 5%
                      y: -5,       // Se eleva ligeramente
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.20)", // Sombra más pronunciada
                      borderColor: '#1a9ca9' // Color de borde de acento
                  }}
                  // Hacemos que la tarjeta sea clickeable/interactiva
                  tabIndex={0}
                  role="button"
                >
                    <div className="gallery-image-wrapper">
                        <img
                          src={item.src}
                          alt={item.mainText}
                          className="gallery-image"
                          loading="lazy"
                        />
                    </div>
                    <div className="gallery-info">
                        <p className="item-main-text">{item.mainText}</p>
                        <p className="item-sub-text">{item.subText}</p>
                    </div>
                </motion.div>
            ))}
        </div>

        <style>{`
            /* Definición de la variable de color de borde */
            .gallery-card {
                --border-color: #e0e0e0;
            }

            .home-gallery-section {
                position: relative;
                z-index: 2;
                max-width: 1200px;
                margin: 80px auto;
                padding: 30px 15px;
            }

            @media (min-width: 768px) {
                .home-gallery-section {
                    margin: 100px auto;
                    padding: 40px 20px;
                }
            }

            .gallery-title {
                font-size: clamp(2rem, 2vw, 3rem);
                font-weight: 800;
                text-align: center;
                margin-bottom: 50px;
                color: #121515;
                letter-spacing: -0.02em;
            }

            /* Estilos Responsive del Grid */
            .home-gallery-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 30px;
                width: 100%;
            }

            @media (min-width: 640px) {
                .home-gallery-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }

            @media (min-width: 1024px) {
                .home-gallery-grid {
                    grid-template-columns: repeat(4, 1fr);
                    gap: 40px;
                }
            }

            /* Estilo de Tarjeta (Card) */
            .gallery-card {
                background: #ffffff;
                border-radius: 8px; /* Borde más redondeado para mejor estética */
                overflow: hidden;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                cursor: pointer; /* Indica que es interactivo */

                /* 🚀 AÑADIMOS BORDE SUAVE */
                border: 1px solid var(--border-color);
            }

            /* Estilo cuando el elemento está enfocado (útil para accesibilidad y simular click) */
            .gallery-card:focus-visible {
                outline: none;
                box-shadow: 0 0 0 3px rgba(26, 156, 169, 0.4); /* Anillo de foco del color de acento */
                border-color: #1a9ca9;
            }


            .gallery-image-wrapper {
                width: 100%;
                height: 0;
                padding-bottom: 125%;
                position: relative;
                overflow: hidden;
                border-radius: 8px 8px 0 0; /* Solo bordes superiores redondeados */
                background: #f0f0f0;
            }

            .gallery-image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
            }

            /* Contenedor de Texto */
            .gallery-info {
                padding: 15px 15px 10px 15px; /* Más padding para que el texto respire */
                text-align: left;
            }

            .item-main-text {
                font-size: 1.1rem;
                font-weight: 700;
                margin-bottom: 3px;
                color: #121515;
            }

            .item-sub-text {
                font-size: 0.9rem;
                font-weight: 400;
                color: #4a5568;
                line-height: 1.4;
            }
        `}</style>
    </section>
);

export default HomeGallery;