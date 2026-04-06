import { lazy, Suspense } from "react";
import { useMediaQuery } from "@/shared/lib/useMediaQuery";
import { prefersReducedMotion } from "@/shared/lib/motion";
import { useTheme } from "@/shared/lib/useTheme";
import { HeroFallback } from "./HeroFallback";
import { HeroOverlay } from "./HeroOverlay";
import styles from "./Hero.module.css";

const HeroScene = lazy(() => import("./HeroScene"));

export const Hero = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reduceMotion = prefersReducedMotion();
  const { theme } = useTheme();

  return (
    <section className={styles.root}>
      {isDesktop && !reduceMotion ? (
        <Suspense fallback={<HeroFallback />}>
          <HeroScene theme={theme} />
        </Suspense>
      ) : (
        <HeroFallback />
      )}
      <HeroOverlay />
    </section>
  );
};
