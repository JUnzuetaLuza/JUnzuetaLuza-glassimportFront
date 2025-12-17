import React, { useEffect, useRef } from "react";

function createParticles() {
  // 1. Obtener el contenedor. Esta línea es CRÍTICA.
  const container = document.getElementById("particles-bg");
  if (!container) {
    console.error("El contenedor #particles-bg no fue encontrado.");
    return;
  }
  
  // Limpiar antes de crear
  container.innerHTML = "";
  
  const numParticles = 42;
  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement("div");
    const size = 16 + Math.random() * 26; // Tamaño de 16px a 42px
    const left = Math.random() * 98; // Posición horizontal (0% a 98% en vw)
    const delay = -Math.random() * 20; // Desfase de animación (para que no empiecen a la vez)
    
    // Colores basados en variables CSS
    const colorVar = Math.random() > 0.5 ? "var(--primary)" : "var(--primary-dark)";
    
    particle.className = "particle";
    
    // 2. Aplicar estilos en línea, incluyendo la posición y tamaño
    particle.style.cssText = `
      left: ${left}vw;
      animation-delay: ${delay}s;
      animation-duration: ${20 + Math.random() * 10}s; /* Duración variable para movimiento más orgánico */
      width: ${size}px;
      height: ${size}px;
      background: ${colorVar};
      box-shadow: 0 0 22px ${colorVar}, 0 0 38px var(--primary-light);
    `;
    container.appendChild(particle);
  }
}

export const ParticlesBackground = () => {
  useEffect(() => {
    // Si la aplicación está dentro de un entorno que requiere una espera mínima
    // para montar el DOM, se puede usar un timeout, pero en React normal no es necesario.
    createParticles();
    
    // Opcional: Si necesitas que las partículas se regeneren al cambiar el tamaño de la ventana:
    // window.addEventListener('resize', createParticles);
    // return () => window.removeEventListener('resize', createParticles);
  }, []); 

  return <div id="particles-bg" className="particles-bg"></div>;
};

export default ParticlesBackground;