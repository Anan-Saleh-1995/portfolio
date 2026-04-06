import { SectionLabel } from "@/shared/ui/SectionLabel";
import styles from "./TheWay.module.css";

const STATS = [
  { value: "3+", label: "Years in production" },
  { value: "3", label: "Languages spoken" },
  { value: "∞", label: "Commits to craft" },
];

export const TheWay = () => (
  <section id="the-way" className={styles.root}>
    <div className={styles.container}>
      <div data-animate>
        <SectionLabel number="02" title="The Way" />
      </div>

      <div className={styles.grid}>
        <div className={styles.content}>
          <h2 className={styles.heading} data-animate>
            The Way
          </h2>
          <p className={styles.bio} data-animate>
            Full-stack developer with 3 years shipping production features
            across React, Meteor, Node.js, MongoDB, and AWS for live web
            products.
          </p>
          <p className={styles.bio} data-animate>
            Built secure S3 upload flows, 2FA and passwordless login systems,
            role-based access strategies, and cron-driven sitemap automation.
            Improved responsiveness on data-heavy screens by moving pagination
            to the server.
          </p>
          <p className={styles.bio} data-animate>
            Currently building a private travel platform for solo travelers and
            guides with MySQL, Redis, MFA, PayPal webhooks, Docker, and
            observability tooling.
          </p>
          <a
            href="https://resume-site-opal-phi.vercel.app/en/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            data-animate
          >
            View Resume →
          </a>
        </div>

        <aside className={styles.aside}>
          <ul className={styles.stats} role="list">
            {STATS.map(({ value, label }) => (
              <li key={label} className={styles.stat} data-animate>
                <span className={styles.statValue}>{value}</span>
                <span className={styles.statLabel}>{label}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  </section>
);
