import { ThemeProvider } from "../shared/lib/ThemeProvider";
import { useSmoothScroll } from "../shared/lib/useSmoothScroll";
import { Home } from "../pages/Home";

function AppContent() {
  useSmoothScroll();
  return <Home />;
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
