import { useRef } from "react";
import { useReducedMotion } from "@/shared/lib/useReducedMotion";
import { HeroCoordinates } from "./HeroCoordinates";
import { HeroOverlay } from "./HeroOverlay";
import { HeroSignalField } from "./HeroSignalField";
import { useHeroIntroAnimation } from "./useHeroIntroAnimation";
import styles from "./Hero.module.css";

export const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useHeroIntroAnimation(heroRef, reduceMotion);

  return (
    <section
      id="top"
      ref={heroRef}
      className={`${styles.root} relative isolate`}
      aria-labelledby="hero-title"
      data-hero-coordinate-surface
    >
      <div className={styles.atmosphere} aria-hidden="true" />
      <HeroOverlay />
      <HeroSignalField />
      <HeroCoordinates />
    </section>
  );
};
