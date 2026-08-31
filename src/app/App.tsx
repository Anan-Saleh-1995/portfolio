import { ThemeProvider } from "@/shared/lib/ThemeProvider";
import { useSmoothScroll } from "@/shared/lib/useSmoothScroll";
import { Cursor } from "@/features/cursor/Cursor";
import { Home } from "@/pages/Home";
import { AppToaster } from "./AppToaster";
import { Analytics } from "@vercel/analytics/react";
import { LocaleProvider } from "@/shared/i18n/LocaleProvider";
import type { Locale } from "@/shared/i18n/config";

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

type AppProps = Readonly<{
  initialLocale: Locale;
}>;

export const App = ({ initialLocale }: AppProps) => (
  <LocaleProvider initialLocale={initialLocale}>
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  </LocaleProvider>
);
