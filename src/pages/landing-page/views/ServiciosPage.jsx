// =================================================================
// src/pages/ServiciosPage.jsx
// Componente principal de la página de Servicios.
// Contiene la lógica interactiva de partículas y la estructura de la página.
// =================================================================

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Wrench, Sun, Shield, Wind, Search, Check, ArrowLeft, ArrowRight, Award, Zap, Heart, CheckCircle } from "lucide-react";

// -----------------------------------------------------------------
// FUNCIÓN DE LÓGICA INTERACTIVA: Partículas en el fondo
// Crea partículas que se mueven y reaccionan a la posición del mouse.
// -----------------------------------------------------------------
function createInteractiveParticles() {
  const container = document.getElementById("particles-bg-servicios");
  if (!container) return;

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

    particles.push({ element: particle, x, y, vx, vy, baseSize: size });
    fragment.appendChild(particle);
  }

  container.appendChild(fragment);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      // Rebotar en los bordes
      if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
      if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

      p.x = Math.max(0, Math.min(window.innerWidth, p.x));
      p.y = Math.max(0, Math.min(window.innerHeight, p.y));

      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 200;

      let moveX = 0, moveY = 0, scale = 1;

      // Lógica para repeler y escalar partículas cerca del cursor
      if (distance < maxDistance) {
        const force = (maxDistance - distance) / maxDistance;
        moveX = (dx / distance) * force * 50;
        moveY = (dy / distance) * force * 50;
        scale = 1 + force * 0.5;
      }

      p.element.style.left = `${p.x}px`;
      p.element.style.top = `${p.y}px`;
      p.element.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// -----------------------------------------------------------------
// DEFINICIÓN DE DATOS ESTRUCTURALES
// -----------------------------------------------------------------

//  Datos de la Cuadrícula de Servicios
const servicios = [
  {
    icon: Car,
    title: "Instalación de Parabrisas",
    desc: "Instalación profesional con materiales certificados y garantía completa.",
    features: ["Vidrios originales", "Garantía 1 año", "Instalación en 2 horas"]
  },
  {
    icon: Wrench,
    title: "Reparación de Fisuras",
    desc: "Reparamos pequeñas fisuras antes de que se extiendan por todo el vidrio.",
    features: ["Proceso rápido", "Sin reemplazo", "Mantiene vidrio original"]
  },
  {
    icon: Sun,
    title: "Polarizado de Lunas",
    desc: "Polarizado profesional con protección UV y control de temperatura.",
    features: ["Bloqueo UV 99%", "Reduce calor", "Diferentes tonalidades"]
  },
  {
    icon: Shield,
    title: "Láminas de Seguridad",
    desc: "Películas de protección que refuerzan tus vidrios contra impactos.",
    features: ["Mayor seguridad", "Anti-rotura", "Protección adicional"]
  },
  {
    icon: Wind,
    title: "Vidrios Laterales",
    desc: "Reemplazo e instalación de vidrios laterales y ventanas.",
    features: ["Stock completo", "Todas las marcas", "Instalación rápida"]
  },
  {
    icon: Search,
    title: "Diagnóstico Gratuito",
    desc: "Evaluamos el estado de tus vidrios sin costo alguno.",
    features: ["Sin compromiso", "Presupuesto gratis", "Asesoría experta"]
  }
];

//  Datos de la sección "Nuestros Valores"
const valuesData = [
    {
        icon: Award,
        title: "Calidad",
        desc: "Materiales certificados de primera"
    },
    {
        icon: Zap,
        title: "Experiencia",
        desc: "Más de 30 años en el rubro"
    },
    {
        icon: Heart,
        title: "Confianza",
        desc: "Miles de clientes satisfechos"
    },
    {
        icon: CheckCircle,
        title: "Garantía",
        desc: "Respaldamos nuestro trabajo"
    }
];

//  Datos de los Seguros y Alianzas (Logos sin filtros de color)
const partnershipsData = {
    assurances: [
        { name: "Pacífico", logo: "/img/pacifico.png" },
        { name: "Mapfre", logo: "/img/mapfre-seguros.png" },
        { name: "La Positiva", logo: "/img/la-positiva-seguros.png" },
        { name: "Quálitas", logo: "/img/qualitas.png" },
    ],
    alliances: [
        { name: "CESVI Argentina", logo: "/img/ccesvi.png" },
        { name: "Sika", logo: "/img/sika.png" },

    ]
};

//  Datos de las Preguntas Frecuentes (FAQ)
const faqData = [
    {
        question: "¿Qué servicios ofrecen?",
        answer: "Ofrecemos instalación de parabrisas, láminas de seguridad y polarizadas para vehículos. También ofrecemos servicios de Delivery."
    },
    {
        question: "¿Cuánto tiempo toma la instalación?",
        answer: "La instalación de parabrisas y láminas generalmente toma entre 2 a 4 horas, dependiendo del tipo de servicio. Durante la espera, puedes disfrutar de la comodidad de nuestro taller, equipado con una sala de estar con TV, dispensador de café y WiFi gratuito."
    },
    {
        question: "¿Usan materiales de calidad?",
        answer: "Sí, trabajamos con marcas como Sika, Johnson Window Films y con cualquier modelo de vehículo para ofrecer un servicio integral a nuestros clientes."
    },
    {
        question: "¿Qué medios de pago tienen?",
        answer: "Aceptamos todos los medios de pago: débito, crédito, Yape, Plin."
    }
];

// -----------------------------------------------------------------
// COMPONENTES DE SECCIÓN
// -----------------------------------------------------------------

// Componente: Sección de Seguros y Alianzas (Posición: 2)
const PartnershipsSection = () => (
    <motion.section
        className="partnerships-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
    >
        <div className="partnerships-content-wrapper">
            <h2 className="partnerships-title">Seguros y Alianzas Comerciales</h2>
            <p className="partnerships-subtitle">
                Trabajamos con distintas aseguradoras y con las mejores marcas para asegurarnos que tu auto tenga los implementos de mejor calidad.
            </p>

            <div className="partners-flex-container">
                {/* Aseguradoras */}
                <div className="partners-group aseguradoras">
                    <h3 className="group-title">Aseguradoras:</h3>
                    <div className="logos-grid grid-assurances">
                        {partnershipsData.assurances.map((partner, i) => (
                            <motion.div
                                key={i}
                                className="logo-card"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <img src={partner.logo} alt={partner.name} className="partner-logo" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Certificados y Aliados */}
                <div className="partners-group aliados">
                    <h3 className="group-title">Certificados / Aliados:</h3>
                    <div className="logos-grid grid-alliances">
                        {partnershipsData.alliances.map((partner, i) => (
                            <motion.div
                                key={i}
                                className="logo-card"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <img src={partner.logo} alt={partner.name} className="partner-logo" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </motion.section>
);

// 💡 Componente: Carrusel de FAQ (Posición: 3)
const FaqSection = () => {
    const [currentFaqIndex, setCurrentFaqIndex] = useState(0);
    const totalFaqs = faqData.length;

    const handleNext = () => {
        setCurrentFaqIndex((prevIndex) => (prevIndex + 1) % totalFaqs);
    };

    const handlePrev = () => {
        setCurrentFaqIndex((prevIndex) => (prevIndex - 1 + totalFaqs) % totalFaqs);
    };

    return (
        <motion.section
            className="faq-carousel-section" // Se le aplicará border-radius aquí
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
        >
            <div className="faq-content-wrapper">
                <h2 className="faq-title">Preguntas Frecuentes</h2>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentFaqIndex}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        className="faq-quote-box"
                    >
                        <p className="faq-question-text">
                            <span className="quote-mark">"</span>{faqData[currentFaqIndex].question}<span className="quote-mark">"</span>
                        </p>
                        <p className="faq-answer-text">
                            {faqData[currentFaqIndex].answer}
                        </p>
                    </motion.div>
                </AnimatePresence>

                <div className="carousel-nav">
                    <motion.button
                        className="nav-button"
                        onClick={handlePrev}
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.4)" }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ArrowLeft size={24} className="nav-icon" />
                    </motion.button>

                    <motion.button
                        className="nav-button"
                        onClick={handleNext}
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.4)" }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ArrowRight size={24} className="nav-icon" />
                    </motion.button>
                </div>
            </div>
        </motion.section>
    );
}


//  Componente: Sección de Valores (Posición: 4)
const ValuesSection = () => (
    <motion.section
        className="values-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
    >
        <h2 className="values-title">Nuestros Valores</h2>
        <div className="values-grid">
            {valuesData.map((val, i) => {
                const Icon = val.icon;
                return (
                    <motion.div
                        key={i}
                        className="value-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.15, duration: 0.5 }}
                        whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
                        viewport={{ once: true }}
                    >
                        <div className="value-icon-wrapper">
                            <Icon size={30} strokeWidth={2} />
                        </div>
                        <h3 className="value-title-card">{val.title}</h3>
                        <p className="value-desc">{val.desc}</p>
                    </motion.div>
                );
            })}
        </div>
    </motion.section>
);

// -----------------------------------------------------------------
// COMPONENTE PRINCIPAL: ServiciosPage
// -----------------------------------------------------------------
export const ServiciosPage = () => {
  // Inicializa el efecto de partículas al montar el componente
  useEffect(() => {
    createInteractiveParticles();
  }, []);

  return (
    <div className="servicios-page">
      {/* Contenedor de las partículas de fondo */}
      <div id="particles-bg-servicios" className="particles-bg"></div>

      <div className="servicios-container">

        {/* 1. Héroe y Subtítulo */}
        <motion.div
          className="servicios-hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="servicios-title">
            Nuestros <span className="gradient-text">Servicios</span>
          </h1>
          <p className="servicios-subtitle">
            Soluciones completas para el cuidado de tus vidrios automotrices
          </p>
        </motion.div>

        {/* 2. Cuadrícula de Servicios (Instalación, Reparación, Polarizado...) */}
        <div className="servicios-grid">
          {servicios.map((servicio, i) => {
            const IconComponent = servicio.icon;
            return (
              <motion.div
                key={i}
                className="servicio-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)" }}
              >
                <div className="servicio-icon">
                  <IconComponent size={48} strokeWidth={1.5} />
                </div>
                <h3 className="servicio-title">{servicio.title}</h3>
                <p className="servicio-desc">{servicio.desc}</p>
                <ul className="servicio-features">
                  {servicio.features.map((feature, j) => (
                    <li key={j}>
                      <span className="check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* 3. Seguros y Alianzas Comerciales */}
        <PartnershipsSection />

        {/* 4. Preguntas Frecuentes */}
        <FaqSection />

        {/* 5. Nuestros Valores */}
        <ValuesSection />

        {/* 6. Llamada a la Acción (Cotización) - POSICIÓN FINAL */}
            <motion.div
        className="cta-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2>¿Necesitas ayuda con tus vidrios?</h2>
        <p>Contáctanos para un diagnóstico gratuito y sin compromiso</p>
        <motion.a
          href="https://api.whatsapp.com/send/?phone=51972771795&text=%C2%A1Hola%2C+Glass+Import%21+Quiero+solucionar+los+problemas+con+mis+lunas.%20&type=phone_number&app_absent=0"
          target="_blank" // Esto es opcional, pero recomendado para abrir WhatsApp en una nueva pestaña
          rel="noopener noreferrer" // Recomendado por seguridad al usar target="_blank"
          className="cta-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Solicitar Cotización
        </motion.a>
      </motion.div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* ESTILOS CSS INLINE PARA EL COMPONENTE */}
      {/* ----------------------------------------------------------------- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

        /* --- Estilos Generales y Partículas --- */
        .servicios-page {
          position: relative;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
          background-color: #f8fafc; /* Fondo general de la página */
        }

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
          will-change: transform, left, top;
          transition: transform 0.2s ease-out;
        }

        .servicios-container {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        /* --- Estilos Héroe --- */
        .servicios-hero {
          text-align: center;
          padding: 60px 20px 40px;
        }

        .servicios-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900;
          color: #121515;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }

        .gradient-text {
          background: linear-gradient(135deg, #1a9ca9, #126c75);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .servicios-subtitle {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: #2d3748;
          font-weight: 500;
          max-width: 600px;
          margin: 0 auto;
        }

        /* --- Estilos Servicios Grid --- */
        .servicios-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 25px;
          margin: 50px 0;
        }

        @media (min-width: 640px) {
          .servicios-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .servicios-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
          }
        }

        .servicio-card {
          background: white;
          border-radius: 20px;
          padding: 35px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .servicio-icon {
          color: #1a9ca9;
          margin-bottom: 20px;
        }

        .servicio-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #121515;
          margin-bottom: 15px;
        }

        .servicio-desc {
          color: #2d3748;
          line-height: 1.7;
          margin-bottom: 20px;
          font-size: 0.95rem;
        }

        .servicio-features {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .servicio-features li {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #2d3748;
          margin-bottom: 10px;
          font-size: 0.9rem;
        }

        .check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          background: #1a9ca9;
          color: white;
          border-radius: 50%;
          font-size: 0.75rem;
          font-weight: bold;
          flex-shrink: 0;
        }

        /* --- Estilos Seguros y Alianzas Comerciales --- */
        .partnerships-section {
            padding: 100px 20px 80px;
            text-align: center;
            background-color: transparent;
            border-radius: 20px;
            margin-bottom: 40px;
            box-shadow: none;
        }

        .partners-flex-container {
            display: flex;
            flex-direction: column;
            gap: 50px;
            justify-content: space-around;
            align-items: flex-start;
            margin-top: 50px;
            background-color: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        @media (min-width: 768px) {
            .partners-flex-container {
                flex-direction: row;
                gap: 5%;
                align-items: flex-start;
            }
            .partners-group {
                flex: 1;
                max-width: 45%;
            }
        }

        .partnerships-title {
            font-size: clamp(2rem, 5vw, 3rem);
            font-weight: 800;
            color: #121515;
            margin-bottom: 20px;
        }

        .partnerships-subtitle {
            font-size: clamp(1rem, 2vw, 1.15rem);
            color: #4a5568;
            max-width: 700px;
            margin: 0 auto 50px;
            line-height: 1.7;
        }

        .partners-group {
            width: 100%;
            text-align: center;
        }

        @media (min-width: 768px) {
             .partners-group {
                text-align: left;
            }
        }

        .group-title {
            font-size: 1.5rem;
            font-weight: 800;
            color: #121515;
            margin-bottom: 30px;
            padding-bottom: 5px;
            border-bottom: 2px solid #e2e8f0;
            display: inline-block;
        }

        .logos-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 30px;
            align-items: center;
            margin-top: 20px;
        }

        @media (min-width: 768px) {
             .logos-grid {
                justify-content: flex-start;
            }
        }

        .partner-logo {
            max-width: 120px;
            max-height: 60px;
            width: auto;
            height: auto;
            object-fit: contain;
            transition: transform 0.3s ease;
            filter: none;
            opacity: 1;
        }

        .logo-card:hover .partner-logo {
            transform: scale(1.08);
        }

        /* --- Estilos FAQ (Preguntas Frecuentes) --- */
        .faq-carousel-section {
            background-color: #126c75;
            padding: 80px 20px;
            margin-top: 60px;
            width: 100%;
            border-radius: 20px; /* <--- APLICADO: Bordes redondeados en el contenedor de FAQ */
        }

        .faq-content-wrapper {
            max-width: 900px;
            margin: 0 auto;
            text-align: center;
        }

        .faq-title {
            font-size: clamp(2rem, 5vw, 3.5rem);
            font-weight: 800;
            color: #ffffff;
            margin-bottom: 40px;
            letter-spacing: -0.02em;
        }

        .faq-quote-box {
            background: none;
            padding: 20px 0;
            min-height: 200px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .faq-question-text {
            font-size: clamp(1.2rem, 2.5vw, 2rem);
            font-weight: 700;
            color: #ffffff;
            line-height: 1.6;
            margin-bottom: 20px;
            max-width: 80%;
        }

        .quote-mark {
            font-size: 1.5em;
            font-weight: 900;
            line-height: 0;
            vertical-align: middle;
            color: rgba(255, 255, 255, 0.8);
            margin: 0 5px;
        }

        .faq-answer-text {
            font-size: clamp(1rem, 2vw, 1.25rem);
            font-weight: 400;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.7;
            max-width: 700px;
            margin: 0 auto;
        }

        .carousel-nav {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 30px;
        }

        .nav-button {
            background-color: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(5px);
            border-radius: 50%;
            width: 45px;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            flex-shrink: 0;
        }

        .nav-icon {
            color: #ffffff;
        }

        .nav-button:hover {
            background-color: #ffffff;
        }

        .nav-button:hover .nav-icon {
             color: #126c75;
        }

        /* --- Estilos Nuestros Valores --- */
        .values-section {
            padding: 60px 20px;
            text-align: center;
            margin-top: 40px;
            margin-bottom: 40px;
        }

        .values-title {
            font-size: clamp(2rem, 5vw, 3rem);
            font-weight: 800;
            color: #121515;
            margin-bottom: 40px;
        }

        .values-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            max-width: 1000px;
            margin: 0 auto;
        }

        .value-card {
            padding: 30px 15px;
            background: white;
            border-radius: 15px;
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        .value-card:hover {
             box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
             transform: translateY(-5px);
        }


        .value-icon-wrapper {
            color: #1a9ca9;
            margin-bottom: 15px;
            height: 40px;
        }

        .value-title-card {
            font-size: 1.15rem;
            font-weight: 700;
            color: #1a9ca9;
            margin-bottom: 10px;
        }

        .value-desc {
            font-size: 0.9rem;
            color: #4a5568;
        }

        /* --- Estilos CTA (Cotización) --- */
        .cta-section {
          background: linear-gradient(135deg, #1a9ca9, #126c75);
          border-radius: 24px;
          padding: 60px 40px;
          text-align: center;
          margin-top: 60px;
          color: white;
          margin-bottom: 80px; /* Espaciado extra al final */
        }

        .cta-section h2 {
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 800;
          margin-bottom: 15px;
        }

        .cta-section p {
          font-size: 1.1rem;
          margin-bottom: 30px;
          opacity: 0.95;
        }

        .cta-button {
          background: white;
          color: #1a9ca9;
          border: none;
          padding: 16px 40px;
          border-radius: 12px;
          font-size: 1.05rem;
           text-decoration: none;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .cta-button:hover {
          box-shadow: 0 6px 30px rgba(0, 0, 0, 0.25);
        }

        /* --- Ajustes Responsive Generales --- */
        @media (max-width: 768px) {
            .partners-flex-container {
                gap: 30px;
                padding: 30px 20px;
            }
            .group-title {
                text-align: center;
            }
            .partner-logo {
                max-height: 50px;
                max-width: 100px;
            }
            .value-card {
                padding: 20px 10px;
            }
             .cta-section {
                padding: 40px 25px;
            }
             .servicio-card {
                padding: 25px;
            }
        }
      `}</style>
    </div>
  );
};

export default ServiciosPage;