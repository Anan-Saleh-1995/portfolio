import { useTheme } from "../shared/lib/useTheme";
import { useSmoothScroll } from "../shared/lib/useSmoothScroll";
import { Home } from "../pages/Home";

export function App() {
  useTheme();
  useSmoothScroll();
  return <Home />;
}
