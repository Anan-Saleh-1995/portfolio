import { Mail, ExternalLink } from "lucide-react";
import { SectionLabel } from "@/shared/ui/SectionLabel";
import { EnsoMark } from "@/shared/ui/EnsoMark";
import styles from "./Contact.module.css";

export const Contact = () => (
  <section id="contact" className={styles.root}>
    <div className={styles.container}>
      <div data-animate>
        <SectionLabel number="05" title="Engagement" />
      </div>

      <div className={styles.body} data-animate>
        <div className={styles.content}>
          <h2 className={styles.heading}>Begin the Conversation</h2>
          <p className={styles.sub}>
            Open to new opportunities, collaborations, and interesting problems.
            Reach out directly.
          </p>

          <ul className={styles.links} role="list">
            <li>
              <a href="mailto:anansaleh18@gmail.com" className={styles.link}>
                <Mail size={16} aria-hidden="true" />
                anansaleh18@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <ExternalLink size={16} aria-hidden="true" />
                GitHub
              </a>
            </li>
          </ul>
        </div>

        <EnsoMark size={160} className={styles.enso} />
      </div>
    </div>
  </section>
);
