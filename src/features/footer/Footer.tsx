import { EnsoMark } from "@/shared/ui/EnsoMark";
import { getHomeContent } from "@/shared/i18n/getHomeContent";
import styles from "./Footer.module.css";

export const Footer = () => {
  const { footer } = getHomeContent();

  return (
    <footer className={styles.root}>
      <div className={styles.inner}>
        <a href="#" className={styles.brand} aria-label={footer.backToTopLabel}>
          <EnsoMark size={16} />
          <span>{footer.brand}</span>
        </a>

        <p className={styles.quote}>{footer.quote}</p>

        <p className={styles.copy}>
          &copy; {new Date().getFullYear()} {footer.copyrightName}
        </p>
      </div>
    </footer>
  );
};
