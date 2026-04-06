import { useRef } from "react";
import { useScrollReveal } from "@/shared/lib/useScrollReveal";
import { SectionLabel } from "@/shared/ui/SectionLabel";
import styles from "./ProvingGround.module.css";

const PROOF_POINTS = [
  { value: "14", label: "Backend modules" },
  { value: "3", label: "Role-based app shells" },
  { value: "65", label: "Server test files" },
];

const STACK = [
  "React",
  "Node.js",
  "Express",
  "MySQL",
  "Knex",
  "Redis",
  "AWS S3",
  "PayPal",
  "Prometheus",
  "Grafana",
  "Docker",
];

const SYSTEMS = [
  "Role-segmented frontend routes and layouts for admin, guide, and traveler flows",
  "Server modules for auth, trips, enrollments, favorites, photos, payments, reports, reviews, profiles, and guide applications",
  "TOTP MFA with enrollment, login challenge, recovery codes, password re-authentication, audit logging, and dedicated implementation docs",
  "Protected photo uploads with server-side image validation, opaque file keys, local and S3 storage drivers, and authorized read access",
  "Booking and payment lifecycle with PayPal order creation, capture handling, rollback paths, refund recovery, notifications, and audit trails",
  "Local observability stack with Redis, Prometheus, Grafana, health endpoints, metrics, and one-command dev startup scripts",
];

export const ProvingGround = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} id="proving-ground" className={styles.root}>
      <div className={styles.container}>
        <div data-animate>
          <SectionLabel number="06" title="Proving Ground" />
        </div>

        <div className={styles.header} data-animate>
          <div className={styles.headingBlock}>
            <h2 className={styles.heading}>The Proving Ground</h2>
            <p className={styles.subheading}>
              Featured build: a private multi-role travel platform for solo
              travelers and local guides.
            </p>
            <p className={styles.statusNote}>
              Still in the forge. A public-facing case study will follow.
            </p>
          </div>
          <p className={styles.note}>
            Private codebase, public proof. This section focuses on system
            design, product constraints, and the engineering work visible in the
            implementation.
          </p>
        </div>

        <div className={styles.grid}>
          <article className={styles.panel} data-animate>
            <span className={styles.eyebrow}>Problem</span>
            <p className={styles.copy}>
              Build a platform that separates traveler, guide, and admin
              responsibilities while keeping booking, media, and account flows
              secure enough for production use.
            </p>
          </article>

          <article className={styles.panel} data-animate>
            <span className={styles.eyebrow}>Role</span>
            <p className={styles.copy}>
              Full-stack ownership across application architecture, backend
              modules, frontend route structure, security-sensitive flows,
              infrastructure ergonomics, and day-to-day engineering decisions.
            </p>
          </article>

          <article className={styles.panelWide} data-animate>
            <span className={styles.eyebrow}>Stack</span>
            <ul className={styles.tags} role="list">
              {STACK.map((item) => (
                <li key={item} className={styles.tag}>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className={styles.contentGrid}>
          <article className={styles.story} data-animate>
            <span className={styles.eyebrow}>Constraints</span>
            <p className={styles.copy}>
              The hard parts were not just CRUD. The system had to enforce
              multi-role access, protect private media, recover safely from
              payment edge cases, keep local development practical, and stay
              observable enough to debug background and runtime behavior.
            </p>

            <span className={styles.eyebrow}>What I Built</span>
            <ul className={styles.systemList} role="list">
              {SYSTEMS.map((item) => (
                <li key={item} className={styles.systemItem}>
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <aside className={styles.aside}>
            <div className={styles.proofCard} data-animate>
              <span className={styles.eyebrow}>Proof</span>
              <ul className={styles.stats} role="list">
                {PROOF_POINTS.map(({ value, label }) => (
                  <li key={label} className={styles.stat}>
                    <span className={styles.statValue}>{value}</span>
                    <span className={styles.statLabel}>{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.proofCard} data-animate>
              <span className={styles.eyebrow}>Impact</span>
              <p className={styles.copy}>
                The result is a platform with clearer role boundaries, safer
                upload and payment flows, better operational visibility, and a
                backend shape that can grow feature-by-feature instead of
                collapsing into a monolith of route handlers.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
