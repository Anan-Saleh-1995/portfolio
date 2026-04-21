import { ThemeProvider } from "@/shared/lib/ThemeProvider";
import { useSmoothScroll } from "@/shared/lib/useSmoothScroll";
import { Cursor } from "@/features/cursor/Cursor";
import { Home } from "@/pages/Home";
import { AppToaster } from "./AppToaster";
import { Analytics } from "@vercel/analytics/react";

const AppContent = () => {
  useSmoothScroll();
  return (
    <>
      <Cursor />
      <Home />
      <AppToaster />
      <Analytics />
    </>
  );
};

export const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);
