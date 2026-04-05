import { ChevronDown } from "lucide-react";
import { SamuraiMark } from "./SamuraiMark";
import styles from "./HeroOverlay.module.css";

export const HeroOverlay = () => (
  <div className={styles.overlay} data-hero-overlay>
    <SamuraiMark className={styles.samurai} />

    <div className={styles.content}>
      <span className={styles.label} data-animate>
        01 / Enter
      </span>
      <h1 className={styles.title} data-animate>
        The Dojo
      </h1>
      <p className={styles.subtitle} data-animate>
        Mastery through discipline.
      </p>
      <p className={styles.role} data-animate>
        Full-Stack Developer
      </p>

      <div className={styles.ctas} data-animate>
        <a href="#about" className={styles.ctaPrimary}>
          Explore
        </a>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ctaSecondary}
        >
          GitHub
        </a>
      </div>
    </div>

    <a
      href="#about"
      className={styles.scrollCue}
      data-animate
      aria-label="Scroll down"
    >
      <ChevronDown size={20} />
    </a>
  </div>
);
