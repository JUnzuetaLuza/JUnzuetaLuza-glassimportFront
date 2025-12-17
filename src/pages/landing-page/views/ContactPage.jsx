// src/pages/ContactPage.jsx

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock, ArrowLeft, ArrowRight, X, Sparkles, Shield, TrendingUp, Handshake } from "lucide-react"; // 💡 MEJORA INTERACTIVA: Íconos para los valores

// Datos de las Preguntas Frecuentes (FAQ)
const faqData = [
    {
        question: "¿Qué servicios ofrecen?",
        answer: "Ofrecemos instalación de parabrisas, láminas de seguridad y polarizadas para vehículos. Además, contamos con el servicio de instalación a domicilio, previa cita."
    },
    {
        question: "¿Cuánto tiempo toma la instalación?",
        answer: "La instalación de parabrisas y láminas generalmente toma entre 2 a 4 horas, dependiendo del tipo de servicio. Durante la espera, puedes disfrutar de la comodidad de nuestro taller, equipado con una sala de estar con TV, dispensador de café y WiFi gratuito."
    },
    {
        question: "¿Tienen garantía?",
        answer: "Sí, ofrecemos garantía en la instalación de parabrisas y láminas, asegurando calidad y durabilidad en nuestro trabajo. Trabajamos con productos de primer nivel, con marcas prestigiosas como Sika, Akfix y Johnson Window Films."
    },
    {
        question: "¿Dónde están ubicados?",
        answer: "Estamos ubicados en el Av. El Ejército 867, Miraflores, a pocas cuadras del Malecón de la Marina."
    },
    {
        question: "¿Cómo puedo agendar una cita?",
        answer: "Déjanos tus datos y nosotros nos encargaremos de contactarte lo más pronto posible."
    },
    {
        question: "¿Aceptan cualquier medio de pago?",
        answer: "Aceptamos todos los medios de pago: tarjeta de débito, crédito, Yape, Plin, efectivo."
    }
];

//  MEJORA INTERACTIVA: Datos de los valores con su respectivo ícono
const valuesData = [
    { title: "Calidad", desc: "Materiales certificados de primera.", icon: Sparkles, color: "#1a9ca9" },
    { title: "Experiencia", desc: "Más de 30 años en el rubro.", icon: TrendingUp, color: "#126c75" },
    { title: "Confianza", desc: "Miles de clientes satisfechos.", icon: Handshake, color: "#0f5a60" },
    { title: "Garantía", desc: "Respaldamos nuestro trabajo.", icon: Shield, color: "#0c4549" }
];


// Componente para el carrusel de FAQ
const FaqSection = () => {
    const [currentFaqIndex, setCurrentFaqIndex] = useState(0);
    const totalFaqs = faqData.length;

    const handleNext = () => {
        setCurrentFaqIndex((prevIndex) => (prevIndex + 1) % totalFaqs);
    };

    const handlePrev = () => {
        setCurrentFaqIndex((prevIndex) => (prevIndex - 1 + totalFaqs) % totalFaqs);
    };

    // 💡 MEJORA INTERACTIVA: Usar un contenedor para controlar el índice y pasar el ítem a mostrar
    return (
        <motion.section
            className="faq-carousel-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
        >
            <div className="faq-content-wrapper">
                <h2 className="faq-title">Preguntas Frecuentes</h2>

                <AnimatePresence mode="wait"> {/* 💡 MEJORA INTERACTIVA: Añadir AnimatePresence para la transición */}
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
                    {/* 💡 MEJORA INTERACTIVA: Mejorar la animación de hover */}
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

// ... (Función createInteractiveParticles sin cambios)
function createInteractiveParticles() {
  const container = document.getElementById("particles-bg-contact");
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

      if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
      if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

      p.x = Math.max(0, Math.min(window.innerWidth, p.x));
      p.y = Math.max(0, Math.min(window.innerHeight, p.y));

      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 200;

      let moveX = 0, moveY = 0, scale = 1;

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
// ... (Fin de createInteractiveParticles)


export const ContactPage = () => {
  useEffect(() => {
    createInteractiveParticles();
  }, []);

  const [showContactOverlay, setShowContactOverlay] = useState(false);

  const contactInfo = {
    location: "Av. El Ejército 867, Miraflores",
    phone: "+51 999 999 999",
    email: "contacto@miempresa.com",
    hours: "Lun - Sáb: 8:00 AM - 6:00 PM"
  };

  return (
    <div className="contact-page">
      <div id="particles-bg-contact" className="particles-bg"></div>

      <div className="contact-container">
        <motion.div
          className="contact-hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="contact-title">
            ¿Quiénes <span className="gradient-text">somos?</span>
          </h1>
          <p className="contact-subtitle">
           Somos una empresa líder en Lima con más de 30 años de experiencia, especializada en la instalación profesional de vidrios para vehículos. Son expertos en servicios clave como el cambio de parabrisas y la colocación de láminas de seguridad y polarizados (que protegen contra robos y rayos UV). La empresa garantiza la máxima calidad en sus instalaciones, respaldada por el uso de productos de marcas prestigiosas
          </p>
        </motion.div>

        <div className="contact-content">
          <motion.div
            className="contact-info-card"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Nuestra Historia</h2>
            <p>
              Desde 1993, hemos sido líderes en instalación, reparación y cuidado de vidrios automotrices.
              Nuestro compromiso con la excelencia nos ha convertido en la primera opción para miles de clientes.
            </p>
            <p>
              Trabajamos con materiales certificados y la tecnología más avanzada del mercado,
              garantizando la seguridad y satisfacción de cada cliente.
            </p>
             {/*  MEJORA INTERACTIVA: Botón con hover interactivo */}
           
          </motion.div>

          {/* ====================================================================== */}
          {/* SECCIÓN DE IMAGEN INTERACTIVA DEL LOCAL (Sin cambios relevantes aquí) */}
          {/* ====================================================================== */}
          <motion.div
            className="local-image-card"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(26, 156, 169, 0.2)" }}
            onClick={() => setShowContactOverlay(true)}
          >
            <img
              src="/img/lugar.jpeg"
              alt="Fachada de nuestro local"
              className="local-image"
              loading="lazy"
            />
            <div className="image-overlay-text">
                Haz clic para ver nuestra dirección y contacto
            </div>
          </motion.div>

        </div>

        {/* 🚀 Overlay de Información de Contacto (Sin cambios relevantes) */}
        <AnimatePresence>
            {showContactOverlay && (
                <motion.div
                    className="contact-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="contact-overlay-content"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <button
                            className="close-overlay-button"
                            onClick={() => setShowContactOverlay(false)}
                        >
                            <X size={24} />
                        </button>
                        <h2>Contáctanos y Visítanos</h2>
                        <div className="contact-item">
                            <MapPin className="contact-icon-svg" size={24} />
                            <div>
                                <strong>Ubicación</strong>
                                <p>{contactInfo.location}</p>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.location)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="map-link"
                                >
                                    Ver en Google Maps
                                </a>
                            </div>
                        </div>
                        <div className="contact-item">
                            <Phone className="contact-icon-svg" size={24} />
                            <div>
                                <strong>Teléfono</strong>
                                <p>{contactInfo.phone}</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <Mail className="contact-icon-svg" size={24} />
                            <div>
                                <strong>Email</strong>
                                <p>{contactInfo.email}</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <Clock className="contact-icon-svg" size={24} />
                            <div>
                                <strong>Horario</strong>
                                <p>{contactInfo.hours}</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>


        <motion.div
          className="values-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Nuestros Valores</h2>
          <div className="values-grid">
            {valuesData.map((value, i) => ( // 💡 MEJORA INTERACTIVA: Usar el nuevo array con íconos
              <motion.div
                key={i}
                className="value-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, boxShadow: `0 15px 45px ${value.color}40` }} // 💡 MEJORA INTERACTIVA: Efecto de sombra con el color del valor
              >
                 <value.icon size={40} className="value-icon" style={{ color: value.color }} /> {/* 💡 MEJORA INTERACTIVA: Renderizar el ícono */}
                <h3>{value.title}</h3>
                <p>{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <FaqSection />

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

        .contact-page {
          position: relative;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
          background-color: #f8fafc; /* Color de fondo claro para mejorar el contraste */
        }

        .particles-bg {
          /* ... (Estilos de partículas sin cambios) */
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
          /* ... (Estilos de partículas sin cambios) */
          position: fixed;
          pointer-events: none;
          will-change: transform, left, top;
          transition: transform 0.2s ease-out;
        }

        .contact-container {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .contact-hero {
          text-align: center;
          padding: 130px 80px 100px;
        }

        .contact-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900;
          color: #121515;
          margin-bottom: 50px;
          letter-spacing: -0.02em;
        }

        .gradient-text {
          background: linear-gradient(135deg, #1a9ca9, #126c75);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .contact-subtitle {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: #2d3748;
          font-weight: 500;
          margin-bottom:60px;
        }

        .contact-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
          margin: 40px 0;
        }

        @media (min-width: 768px) {
          .contact-content {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
        }

        .contact-info-card {
          background: white;
          border-radius: 20px;
          padding: 35px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* 💡 MEJORA INTERACTIVA: Estilo del botón primario */
        .btn-primary {
            display: inline-block;
            background: linear-gradient(45deg, #1a9ca9, #126c75);
            color: white;
            padding: 12px 9px ;
            border-radius: 10px;
            font-weight: 700;
            text-decoration: none;
            text-align: center;
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
        }


        .contact-info-card h2 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #121515;
          margin-bottom: 20px;
        }

        .contact-info-card p {
          color: #2d3748;
          line-height: 1.7;
          margin-bottom: 15px;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 20px;
        }

        .contact-icon-svg {
          color: #1a9ca9;
          flex-shrink: 0;
        }

        .contact-item strong {
          display: block;
          color: #1a9ca9;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .contact-item p {
          margin: 0;
          color: #2d3748;
        }

        /* Estilos para la nueva tarjeta de imagen del local */
        .local-image-card {
            position: relative;
            background: #f0f4f8;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 250px;
        }

        .local-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.3s ease;
        }

        .local-image-card:hover .local-image {
            transform: scale(1.05);
        }

        .image-overlay-text {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
            color: white;
            padding: 20px;
            font-size: 1.1rem;
            font-weight: 600;
            text-align: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .local-image-card:hover .image-overlay-text {
            opacity: 1;
        }

        /* Estilos para el Overlay de Contacto */
        .contact-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
        }

        .contact-overlay-content {
            background: white;
            border-radius: 20px;
            padding: 40px;
            position: relative;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
            text-align: left;
        }

        .contact-overlay-content h2 {
            font-size: 2rem;
            font-weight: 800;
            color: #1a9ca9;
            margin-bottom: 30px;
            text-align: center;
        }

        .close-overlay-button {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 10px;
            border-radius: 50%;
            transition: background-color 0.2s ease;
        }

        .close-overlay-button svg {
            color: #2d3748;
        }

        .close-overlay-button:hover {
            background-color: #f0f4f8;
        }

        .contact-overlay-content .contact-item strong {
            color: #121515;
        }

        .map-link {
            color: #1a9ca9;
            text-decoration: none;
            font-weight: 600;
            margin-top: 5px;
            display: inline-block;
            transition: color 0.2s ease;
        }

        .map-link:hover {
            color: #126c75;
            text-decoration: underline;
        }

        /* --- Valores Section --- */
        .values-section {
          margin-top: 60px;
        }

        .section-title {
          text-align: center;
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 800;
          color: #121515;
          margin-bottom: 40px;
        }

        .values-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 640px) {
          .values-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .values-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .value-card {
          background: white;
          border-radius: 16px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          display: flex; /* 💡 MEJORA INTERACTIVA: Añadir Flex para centrar */
          flex-direction: column;
          align-items: center;
        }

        .value-icon {
            margin-bottom: 15px;
        }

        .value-card h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #1a9ca9;
          margin-bottom: 10px;
        }

        .value-card p {
          color: #2d3748;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        /* --- ESTILOS PARA LA SECCIÓN DE PREGUNTAS FRECUENTES (FAQ) --- */
        .faq-carousel-section {
            /* 💡 MEJORA INTERACTIVA: Cambiar el color para un mejor contraste y aspecto moderno */
            background-color: #126c75;
            padding: 80px 20px;
            margin-top: 60px;
            width: 100%;
        }

        .faq-content-wrapper {
            max-width: 900px;
            margin: 0 auto;
            text-align: center;
        }

        .faq-title {
            font-size: clamp(2rem, 5vw, 2.5rem);
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
            border: 1px solid rgba(255, 255, 255, 0.3); /* 💡 MEJORA INTERACTIVA: Borde para efecto Glassmorphism */
            backdrop-filter: blur(5px); /* 💡 MEJORA INTERACTIVA: Añadir blur */
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
             color: #126c75; /* 💡 MEJORA INTERACTIVA: Color del icono al hacer hover */
        }

      `}</style>
    </div>
  );
};

export default ContactPage;