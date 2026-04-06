import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { getHomeContent } from "@/shared/i18n/getHomeContent";
import { useHeroIntroAnimation } from "./useHeroIntroAnimation";
import { SamuraiMark } from "./SamuraiMark";
import styles from "./HeroOverlay.module.css";

export const HeroOverlay = () => {
  const overlayRef = useRef<HTMLDivElement>(null);
  useHeroIntroAnimation(overlayRef);
  const { hero } = getHomeContent();

  return (
    <div ref={overlayRef} className={styles.overlay}>
      <SamuraiMark className={styles.samurai} />

      <div className={styles.content}>
        <span className={styles.label} data-animate>
          {hero.sectionNumber} / {hero.sectionTitle}
        </span>
        <h1 className={styles.title} data-animate>
          {hero.title}
        </h1>
        <p className={styles.subtitle} data-animate>
          {hero.subtitle}
        </p>
        <p className={styles.role} data-animate>
          {hero.role}
        </p>

        <div className={styles.ctas} data-animate>
          <a href={hero.primaryCta.href} className={styles.ctaPrimary}>
            {hero.primaryCta.label}
          </a>
          <a
            href={hero.secondaryCta.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaSecondary}
          >
            {hero.secondaryCta.label}
          </a>
        </div>
      </div>

      <a
        href="#the-way"
        className={styles.scrollCue}
        data-animate
        aria-label={hero.scrollCueLabel}
      >
        <ChevronDown size={20} />
      </a>
    </div>
  );
};
