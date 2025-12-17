// src/pages/HomePage.jsx
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import HomeGallery from "../../../components/HomeGallery";

function createInteractiveParticles() {
  const container = document.getElementById("particles-bg");
  if (!container) {
    console.error("El contenedor #particles-bg no fue encontrado.");
    return;
  }

  container.innerHTML = "";

  const numParticles = 50;
  const particles = [];
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement("div");
    const size = 8 + Math.random() * 20;

    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    const colorVar = Math.random() > 0.5 ? "#1a9ca9" : "#126c75";

    // Velocidades aleatorias para movimiento orgánico
    const vx = (Math.random() - 0.5) * 0.5;
    const vy = (Math.random() - 0.5) * 0.5;

    particle.className = "particle-interactive";
    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: ${colorVar};
      border-radius: 50%;
      opacity: 0.5;
      box-shadow: 0 0 15px ${colorVar};
      pointer-events: none;
    `;

    particles.push({
      element: particle,
      x,
      y,
      vx,
      vy,
      baseSize: size
    });
    fragment.appendChild(particle);
  }

  container.appendChild(fragment);

  // Efecto de seguir al mouse
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    particles.forEach((p) => {
      // Movimiento orgánico continuo
      p.x += p.vx;
      p.y += p.vy;

      // Rebotar en los bordes
      if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
      if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

      // Mantener dentro de la pantalla
      p.x = Math.max(0, Math.min(window.innerWidth, p.x));
      p.y = Math.max(0, Math.min(window.innerHeight, p.y));

      // Interacción con el mouse
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 200;

      let moveX = 0;
      let moveY = 0;
      let scale = 1;

      if (distance < maxDistance) {
        const force = (maxDistance - distance) / maxDistance;
        moveX = (dx / distance) * force * 50;
        moveY = (dy / distance) * force * 50;
        scale = 1 + force * 0.5;
      }

      // Aplicar posición y transformación
      p.element.style.left = `${p.x}px`;
      p.element.style.top = `${p.y}px`;
      p.element.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
    });

    requestAnimationFrame(animate);
  }

  animate();
}

export const HomePage = () => {
  useEffect(() => {
    createInteractiveParticles();
  }, []);

  // Array de servicios para la sección de grid
  const mainServices = [
    {
      title: "Instalación de Parabrisas",
      text: "La más amplia gama de vidrios automotrices de alta calidad con instalación profesional garantizada.",
      icon: "🚗"
    },
    {
      title: "Láminas de Seguridad",
      text: "Protección contra impactos, reducción de calor y bloqueo de hasta el 99% de rayos UV.",
      icon: "🛡️"
    },
    {
      title: "Reparación de Piquetes",
      text: "Servicio rápido con resina avanzada para evitar la propagación del daño y el reemplazo total.",
      icon: "🛠️"
    },
  ];


  return (
    <div className="home-main">
      {/* Partículas interactivas */}
      <div id="particles-bg" className="particles-bg"></div>


      <motion.section
        className="home-section home-hero-centered"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="home-title-restored"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Lunas perfectas. <span className="home-subtitle">Máxima seguridad.</span>
        </motion.h1>

        <motion.div
          className="home-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Somos Glass Import: Más de <span className="text-highlight">30 años</span> cuidando tu auto.
          <br />
          Expertos en instalación, reparación y cuidado de vidrios automotrices.
        </motion.div>

      </motion.section>



      <motion.section
        className="home-section home-service-grid"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className="service-text-container"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="home-subtitle-text">Servicio profesional</h2>
          <div className="home-text">
            Materiales certificados y tecnología avanzada.
            <br />
            Técnicos capacitados. Seguridad garantizada.
          </div>
        </motion.div>

        <motion.div
          className="service-image-container"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Mantenemos la imagen original: colocacion.jpeg */}
          <img
            src="/img/lunacocheopel.jpg"
            alt="Técnico realizando la instalación de una luna de coche"
            className="home-installation-img"
            loading="lazy"
          />
        </motion.div>
      </motion.section>


      <motion.section
        className="home-section home-service-grid reversed"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className="service-text-container alliances-text"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
        <h2 className="home-subtitle-text alliances-title">
          Alianzas y certificados para tu seguridad
        </h2>
        <div className="home-text alliances-p-text">
          Trabajamos con marcas de prestigio como Sika, Akfix y Johnson Window Films. Además, contamos con un certificado de Cesvi Argentina, todo pensando en asegurar la mejor calidad de instalación para tu vehículo
        </div>
        <motion.a // Cambiado de motion.button a motion.a
          className="contact-button"
          href="https://api.whatsapp.com/send/?phone=51972771795&text=%C2%A1Hola%2C+Glass+Import%21+Quiero+solucionar+los+problemas+con+mis+lunas.%20&type=phone_number&app_absent=0" // Agregado el atributo href
          target="_blank" // Opcional: Para abrirlo en una nueva pestaña
          rel="noopener noreferrer" // Opcional: Recomendado por seguridad al usar target="_blank"
          whileHover={{ scale: 0.95 }}
          whileTap={{ scale: 0.95 }}
        >
          Contáctanos
        </motion.a>

        </motion.div>

        <motion.div
          className="service-image-container"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Mantenemos la imagen original: demostracion.png */}
          <img
            src="/img/modelodos.jpeg"
            alt="Técnico aplicando una lámina de seguridad en el vidrio de un auto"
            className="home-installation-img"
            loading="lazy"
          />
        </motion.div>
      </motion.section>


      <motion.section
        className="home-section hero-full-grid"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="hero-text-container">
          <h2 className="hero-title">
            Líderes en la instalación de vidrios para tu auto
          </h2>
          <p className="home-text alliances-p-text">
            En Glass Import, somos expertos en la instalación de parabrisas y láminas de seguridad y polarizadas para su vehículo.
          </p>
       
        </div>

        <div className="hero-image-container">
          {/* Mantenemos la imagen original: lugar.jpeg */}
          <img
            src="/img/luna.png"
            alt="Fachada del local de Glass Import con autos estacionados"
            className="hero-main-img"
            loading="lazy"
          />
        </div>
      </motion.section>

      {/* ====================================================================== */}
      {/* 5. NUESTRAS SOLUCIONES PRINCIPALES (GRID DE 3 TARJETAS) */}
      {/* ====================================================================== */}
      <motion.section
        className="home-section"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="home-subtitle-text" style={{ textAlign: "center", marginBottom: "40px" }}>
          Nuestras Soluciones Principales
        </h2>

        <div className="services-key-grid">
          {mainServices.map((item, index) => (
            <motion.div
              key={index}
              className="service-key-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(26, 156, 169, 0.2)" }}
            >
              <div className="service-key-icon">{item.icon}</div>
              <h3 className="service-key-title">{item.title}</h3>
              <p className="home-text" style={{ fontSize: "1rem" }}>
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>


      {/* ====================================================================== */}
      {/* 6. GALERÍA */}
      {/* ====================================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <HomeGallery />
      </motion.div>

      {/* ====================================================================== */}
      {/* --- ESTILOS CSS --- (Se mantiene igual, ahora es consistente) */}
      {/* ====================================================================== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

        * {
          box-sizing: border-box;
        }

        .home-main {
          position: relative;
          min-height: 100vh;
          padding: 20px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
        }

        /* Partículas interactivas */
        .particles-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
          pointer-events: none;
        }

        .particle-interactive {
          position: fixed;
          pointer-events: none;
          will-change: transform;
        }

        /* Secciones */
        .home-section {
          position: relative;
          z-index: 2;
          max-width: 1100px;
          margin: 80px auto;
          padding: 30px;
        }

        /* --- 1. HERO CENTRADO (Lunas Perfectas) --- */
        .home-hero-centered {
            text-align: center;
            padding: 90px 15px 40px;
            padding-home-title-restoredtop:40px;
        }

        .home-title-restored {
            font-size: clamp(1.75rem, 5vw, 4rem);
            font-weight: 900;
            color: #121515;
            margin-bottom: 20px;
            line-height: 1.15;
            letter-spacing: -0.02em;
        }

        @media (min-width: 768px) {
          .home-title-restored {
            margin-bottom: 50px;
          }
          .home-hero-centered {
            padding: 80px 20px 60px;
          }
        }

        .home-subtitle {
          display: block;
          background: linear-gradient(135deg, #1a9ca9, #126c75);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
        }

        .home-text {
          font-size: clamp(0.95rem, 1vw, 1.25rem);
          color: #2d3748;
          line-height: 1.7;
          max-width: 600px;
          margin: 0 auto;
          padding-bottom:5px;
          font-weight: 400;
        }

        .text-highlight {
          font-weight: 800;
          color: #1a9ca9;
          padding: 0 6px;
        }

        /* --- 2, 3. Grid de Servicios (Servicio Profesional y Alianzas) --- */
        .home-service-grid {
          display: flex;
          flex-direction: column;
          gap: 25px;
          align-items: stretch;
        }

        @media (min-width: 768px) {
          .home-service-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            align-items: center;
          }

          /* Orden normal para la SECCIÓN 2: Texto (1) - Imagen (2) */
          .home-service-grid:not(.reversed) .service-text-container {
            order: 1;
          }
          .home-service-grid:not(.reversed) .service-image-container {
            order: 2;
          }

          /* Orden invertido para la SECCIÓN 3: Imagen (1) - Texto (2) */
          .home-service-grid.reversed .service-text-container {
              order: 2;
          }
          .home-service-grid.reversed .service-image-container {
              order: 1;
          }
        }

        /* Estilos generales de texto/imagen en grid */
        .service-text-container {
            order: 2; /* Default en móvil */
        }

        .home-subtitle-text {
          font-size: clamp(1.5rem, 3.5vw, 2.5rem);
          font-weight: 800;
          margin-bottom: 15px;
          color: #121515;
          letter-spacing: -0.01em;
        }

        /* Imagen */
        .service-image-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          order: 1; /* Default en móvil */
        }

        .home-installation-img {
          width: 100%;
          height: auto;
          max-height: 300px;
          display: block;
          object-fit: cover;
          object-position: center;
        }

        @media (min-width: 768px) {
          .service-image-container {
            border-radius: 20px;
          }
          .home-installation-img {
            max-height: 310px;
          }
        }

        /* --- 5. SOLUCIONES PRINCIPALES (Grid de tarjetas) --- */
        .services-key-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
            margin-top: 30px;
        }

        .service-key-card {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
        }

        .service-key-icon {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }

        .service-key-title {
            font-size: 1.35rem;
            font-weight: 700;
            color: #1a9ca9;
            margin-bottom: 8px;
            letter-spacing: -0.01em;
        }

        /* --- 4. LÍDERES EN LA INSTALACIÓN (HERO GRID) --- */
        .hero-full-grid {
            display: flex;
            flex-direction: column;
            gap: 30px;
            align-items: center;
            padding-top: 60px;
            padding-bottom: 60px;
        }

        @media (min-width: 768px) {
            .hero-full-grid {
                display: grid;
                grid-template-columns: 1fr 1.2fr;
                gap: 50px;
                padding-top: 80px;
                padding-bottom: 80px;
                min-height: 600px;
            }
        }

        .hero-text-container {
            order: 2;
            text-align: left;
        }

        @media (min-width: 768px) {
            .hero-text-container {
                order: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
        }

        .hero-image-container {
            order: 1;
            width: 100%;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            max-width: 100%;
        }

        @media (min-width: 768px) {
            .hero-image-container {
                order: 2;
            }
        }

        .hero-main-img {
            width: 100%;
            height: auto;
            max-height: 400px;
            object-fit: cover;
            display: block;
        }

        @media (min-width: 768px) {
            .hero-main-img {
                max-height: 550px;
            }
        }

        .hero-title {
            font-size: clamp(3rem, 2vw, 4.5rem);
            font-weight: 700;
            color: #121515;
            line-height: 1.1;
            letter-spacing: -0.03em;
            margin-bottom: 20px;
        }

        .hero-text-description {
            font-size: clamp(1rem, 2vw, 1.3rem);
            color: #4a5568;
            line-height: 1.6;
            margin-bottom: 30px;
        }

        /* Botones */
        .contact-button, .secondary-button {
            padding: 10px 40px;
            font-size: 1rem;
            font-weight: 600;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
            margin-top: 0px;
        }

        .contact-button {
            background-color: #ffffff;
            color: #1a9ca9;
            border: 2px solid #1a9ca9;

        }

        .contact-button:hover {
            background-color: #1a9ca9;
            color: #ffffff;
            box-shadow: 0 5px 15px rgba(26, 156, 169, 0.4);
        }

        .secondary-button {
            background-color: transparent;
            color: #1a9ca9;
            border: 2px solid #1a9ca9;
        }

        .secondary-button:hover {
            background-color: #1a9ca9;
            color: #ffffff;
        }
      `}</style>
    </div>
  );
};

export default HomePage;