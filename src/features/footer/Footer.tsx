import { ArrowUp, ArrowUpRight } from "lucide-react";
import { EnsoMark } from "@/shared/ui/EnsoMark";
import { shellContent } from "@/shared/content/shell.content";
import { SocialBrandIcon } from "./SocialBrandIcon";
import styles from "./Footer.module.css";

export const Footer = () => {
  const { footer, nav } = shellContent;

  return (
    <footer className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.map}>
          <div className={styles.introduction}>
            <a
              href="#top"
              className={styles.brand}
              aria-label={footer.backToTopLabel}
            >
              <EnsoMark size={22} />
              <span>{footer.brand}</span>
            </a>
            <h2 className={styles.heading}>{footer.heading}</h2>
            <p className={styles.description}>{footer.description}</p>
          </div>

          <nav aria-label={footer.chaptersLabel}>
            <h3 className={styles.groupLabel}>{footer.chaptersLabel}</h3>
            <ul className={styles.chapterList} role="list">
              {nav.links.map(({ href, label }) => (
                <li key={href}>
                  <a
                    className={styles.chapterLink}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={footer.destinationsLabel}>
            <h3 className={styles.groupLabel}>{footer.destinationsLabel}</h3>
            <ul className={styles.destinationList} role="list">
              {footer.destinations.map(({ href, label, description }) => (
                <li key={href}>
                  <a
                    className={styles.destinationLink}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={styles.destinationTitle}>
                      {label}
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </span>
                    <span className={styles.destinationDescription}>
                      {description}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.socials}>
          <h3 className={styles.socialLabel}>{footer.socialLabel}</h3>
          <ul className={styles.socialList} role="list">
            {footer.socialProfiles.map(({ brand, label, href }) => {
              const content = (
                <>
                  <SocialBrandIcon brand={brand} />
                  <span className={styles.socialName}>
                    {label}
                    {!href && (
                      <span className={styles.socialStatus}>
                        {footer.profileSoonLabel}
                      </span>
                    )}
                  </span>
                  {href && <ArrowUpRight size={14} aria-hidden="true" />}
                </>
              );

              return (
                <li key={brand}>
                  {href ? (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      href={href}
                    >
                      {content}
                    </a>
                  ) : (
                    <div className={styles.socialPending}>{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.utility}>
          <p className={styles.copy}>
            &copy; {new Date().getFullYear()} {footer.copyrightName}
          </p>
          <p className={styles.quote}>{footer.quote}</p>
          <a className={styles.backToTop} href="#top">
            {footer.backToTopLabel}
            <ArrowUp size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
};
