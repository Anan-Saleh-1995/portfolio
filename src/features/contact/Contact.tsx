import { useRef } from "react";
import { Mail, ExternalLink } from "lucide-react";
import { homeContent } from "@/shared/content/home";
import { useScrollReveal } from "@/shared/lib/useScrollReveal";
import { SectionLabel } from "@/shared/ui/SectionLabel";
import { ContactForm } from "./ContactForm/ContactForm";
import styles from "./Contact.module.css";

export const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  const { contact } = homeContent;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={styles.root}
      aria-labelledby="contact-heading"
    >
      <div className={styles.container}>
        <div data-animate>
          <SectionLabel
            number={contact.sectionNumber}
            title={contact.sectionTitle}
          />
        </div>

        <div className={styles.body}>
          <div className={styles.introduction} data-animate>
            <h2 id="contact-heading" className={styles.heading}>
              {contact.heading}
            </h2>
            <p className={styles.sub}>{contact.subheading}</p>
            <aside
              className={styles.channels}
              aria-labelledby="contact-channels-label"
            >
              <h3 id="contact-channels-label" className={styles.channelsLabel}>
                {contact.channelsLabel}
              </h3>
              <ul className={styles.links} role="list">
                <li className={styles.emailChannel}>
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
                    GitHub
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a
                    href={contact.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    Resume
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                </li>
              </ul>
            </aside>
          </div>

          <div className={styles.formColumn} data-animate>
            <div className={styles.formHeading}>
              <span className={styles.formMark} aria-hidden="true" />
              <h3 className={styles.formLabel}>Start a conversation</h3>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};
