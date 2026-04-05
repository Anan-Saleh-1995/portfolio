import { lazy, Suspense } from "react";
import { useMediaQuery } from "@/shared/lib/useMediaQuery";
import { useTheme } from "@/shared/lib/useTheme";
import { HeroFallback } from "./HeroFallback";
import { HeroOverlay } from "./HeroOverlay";
import styles from "./Hero.module.css";

const HeroScene = lazy(() => import("./HeroScene"));

export function Hero() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { theme } = useTheme();

  return (
    <section className={styles.root}>
      {isDesktop ? (
        <Suspense fallback={<HeroFallback />}>
          <HeroScene theme={theme} />
        </Suspense>
      ) : (
        <HeroFallback />
      )}
      <HeroOverlay />
    </section>
  );
}
