import { ThemeProvider } from "@/shared/lib/ThemeProvider";
import { useSmoothScroll } from "@/shared/lib/useSmoothScroll";
import { Cursor } from "@/features/cursor/Cursor";
import { Home } from "@/pages/Home";

const AppContent = () => {
  useSmoothScroll();
  return (
    <>
      <Cursor />
      <Home />
    </>
  );
};

export const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);
