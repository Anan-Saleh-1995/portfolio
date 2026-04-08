import { useRef } from "react";
import { Mail, ExternalLink } from "lucide-react";
import { getHomeContent } from "@/shared/i18n/getHomeContent";
import { useScrollReveal } from "@/shared/lib/useScrollReveal";
import { SectionLabel } from "@/shared/ui/SectionLabel";
import { ContactForm } from "./ContactForm/ContactForm";
import styles from "./Contact.module.css";

export const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  const { contact } = getHomeContent();

  return (
    <section ref={sectionRef} id="contact" className={styles.root}>
      <div className={styles.container}>
        <div data-animate>
          <SectionLabel
            number={contact.sectionNumber}
            title={contact.sectionTitle}
          />
        </div>

        <div className={styles.body} data-animate>
          <div className={styles.formColumn}>
            <h2 className={styles.heading}>{contact.heading}</h2>
            <p className={styles.sub}>{contact.subheading}</p>

            <ContactForm />
          </div>
        </div>

        <div className={styles.channels} data-animate>
          <span className={styles.channelsLabel}>{contact.channelsLabel}</span>
          <ul className={styles.links} role="list">
            <li>
              <a href={`mailto:${contact.email}`} className={styles.link}>
                <Mail size={16} aria-hidden="true" />
                {contact.email}
              </a>
            </li>
            <li>
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <ExternalLink size={16} aria-hidden="true" />
                GitHub
              </a>
            </li>
            <li>
              <a
                href={contact.resume}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <ExternalLink size={16} aria-hidden="true" />
                Resume
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
