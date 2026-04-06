import { EnsoMark } from "@/shared/ui/EnsoMark";
import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.root}>
      <div className={styles.inner}>
        <a href="#" className={styles.brand} aria-label="Back to top">
          <EnsoMark size={16} />
          <span>anan</span>
        </a>

        <p className={styles.quote}>
          "Today is victory over yourself of yesterday."
        </p>

        <p className={styles.copy}>
          &copy; {new Date().getFullYear()} Anan Saleh
        </p>
      </div>
    </footer>
  );
};
