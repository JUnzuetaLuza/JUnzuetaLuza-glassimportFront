import { Buffer } from 'buffer';

// Polyfills para sockjs-client y otras librerías Node.js
window.global = window;
window.Buffer = Buffer;
window.process = {
  env: { DEBUG: undefined },
  version: '',
  nextTick: (fn, ...args) => setTimeout(() => fn(...args), 0)
};

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GlassImportApp } from "./GlassImportApp";

//import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GlassImportApp />
  </StrictMode>
);
