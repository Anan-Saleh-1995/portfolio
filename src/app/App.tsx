import { useTheme } from "../shared/lib/useTheme";
import { Home } from "../pages/Home";

export function App() {
  useTheme();
  return <Home />;
}
