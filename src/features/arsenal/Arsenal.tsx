import { useRef } from "react";
import { getHomeContent } from "@/shared/i18n/getHomeContent";
import { useScrollReveal } from "@/shared/lib/useScrollReveal";
import { SectionLabel } from "@/shared/ui/SectionLabel";
import styles from "./Arsenal.module.css";

export const Arsenal = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  const { arsenal } = getHomeContent();

  return (
    <section ref={sectionRef} id="arsenal" className={styles.root}>
      <div className={styles.container}>
        <div data-animate>
          <SectionLabel
            number={arsenal.sectionNumber}
            title={arsenal.sectionTitle}
          />
        </div>
        <h2 className={styles.heading} data-animate>
          {arsenal.heading}
        </h2>

        <div className={styles.groups}>
          {arsenal.groups.map(({ category, items }) => (
            <div key={category} className={styles.group} data-animate>
              <span className={styles.category}>{category}</span>
              <ul className={styles.tags} role="list">
                {items.map((skill) => (
                  <li key={skill} className={styles.tag}>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
