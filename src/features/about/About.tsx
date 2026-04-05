import { SectionLabel } from "@/shared/ui/SectionLabel";
import styles from "./About.module.css";

const STATS = [
  { value: "3+", label: "Years in production" },
  { value: "3", label: "Languages spoken" },
  { value: "∞", label: "Commits to craft" },
];

export function About() {
  return (
    <section id="about" className={styles.root}>
      <div className={styles.container}>
        <div data-animate>
          <SectionLabel number="02" title="About" />
        </div>

        <div className={styles.grid}>
          <div className={styles.content}>
            <h2 className={styles.heading} data-animate>
              The Path
            </h2>
            <p className={styles.bio} data-animate>
              Full-stack developer with 3 years building and maintaining
              production systems with Node.js, TypeScript, and AWS. I deliver
              secure API flows, S3-backed file pipelines, role-based access
              controls, and server-side optimizations for data-heavy products.
            </p>
            <p className={styles.bio} data-animate>
              Currently building a multi-role travel platform and sharpening
              skills in Three.js. Every commit is a step in the kata.
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
}
