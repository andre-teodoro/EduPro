import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import "@edupro/ui/styles.css";
import { App } from "./App";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
