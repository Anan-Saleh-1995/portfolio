import { ThemeProvider } from "../shared/lib/ThemeProvider";
import { useSmoothScroll } from "../shared/lib/useSmoothScroll";
import { useScrollAnimations } from "../shared/lib/useScrollAnimations";
import { Home } from "../pages/Home";

function AppContent() {
  useSmoothScroll();
  useScrollAnimations();
  return <Home />;
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
