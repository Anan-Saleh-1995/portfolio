import { useRef } from "react";
import { Mail, ExternalLink } from "lucide-react";
import { useScrollReveal } from "@/shared/lib/useScrollReveal";
import { SectionLabel } from "@/shared/ui/SectionLabel";
import { EnsoMark } from "@/shared/ui/EnsoMark";
import { ContactForm } from "./contactForm";
import styles from "./Contact.module.css";

export const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} id="contact" className={styles.root}>
      <div className={styles.container}>
        <div data-animate>
          <SectionLabel number="05" title="Engagement" />
        </div>

        <div className={styles.body} data-animate>
          <div className={styles.formColumn}>
            <h2 className={styles.heading}>State Your Intent</h2>
            <p className={styles.sub}>
              Opportunities, alliances, and worthy challenges are welcome. Send
              word.
            </p>

            <ContactForm />
          </div>

          <EnsoMark size={160} className={styles.enso} />
        </div>

        <div className={styles.channels} data-animate>
          <span className={styles.channelsLabel}>Direct Channels</span>
          <ul className={styles.links} role="list">
            <li>
              <a href="mailto:anansaleh18@gmail.com" className={styles.link}>
                <Mail size={16} aria-hidden="true" />
                anansaleh18@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Anan-Saleh-1995"
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
      </div>
    </section>
  );
};
