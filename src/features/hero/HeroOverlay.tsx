import { ChevronDown } from "lucide-react";
import { SamuraiMark } from "./SamuraiMark";
import styles from "./HeroOverlay.module.css";

export function HeroOverlay() {
  return (
    <div className={styles.overlay}>
      <SamuraiMark className={styles.samurai} />

      <div className={styles.content}>
        <span className={styles.label}>01 / Enter</span>
        <h1 className={styles.title}>The Dojo</h1>
        <p className={styles.subtitle}>Mastery through discipline.</p>
        <p className={styles.role}>Full-Stack Developer</p>

        <div className={styles.ctas}>
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

      <a href="#about" className={styles.scrollCue} aria-label="Scroll down">
        <ChevronDown size={20} />
      </a>
    </div>
  );
}
