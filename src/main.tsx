import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./app/index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Application root element was not found.");
}

document.documentElement.lang = "en";
document.documentElement.dir = "ltr";
document.documentElement.translate = false;
document.documentElement.classList.add("notranslate");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
