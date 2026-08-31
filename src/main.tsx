import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { detectInitialLocale } from "./shared/i18n/detectLocale";
import { applyDocumentLocale } from "./shared/i18n/direction";
import { activateInitialLocale } from "./shared/i18n/i18n";
import "./app/index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Application root element was not found.");
}

const bootstrap = async () => {
  const requestedLocale = detectInitialLocale();
  const initialLocale = await activateInitialLocale(requestedLocale);

  applyDocumentLocale(initialLocale);

  createRoot(rootElement).render(
    <StrictMode>
      <App initialLocale={initialLocale} />
    </StrictMode>,
  );
};

void bootstrap().catch((error: unknown) => {
  console.error("Application locale bootstrap failed.", error);
});
