import { useRef } from "react";
import { useScrollReveal } from "@/shared/lib/useScrollReveal";
import { SectionLabel } from "@/shared/ui/SectionLabel";
import styles from "./Arsenal.module.css";

const SKILLS = [
  {
    category: "Backend",
    items: [
      "Node.js",
      "Express",
      "NestJS",
      "REST APIs",
      "OpenAPI",
      "Swagger",
      "Authentication",
    ],
  },
  {
    category: "Frontend",
    items: [
      "React",
      "React Router",
      "TanStack Query",
      "React Hook Form",
      "Vite",
    ],
  },
  {
    category: "UI Systems",
    items: ["Ant Design", "MUI", "shadcn/ui", "Tailwind CSS"],
  },
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript", "SQL", "Bash", "PowerShell"],
  },
  {
    category: "Data",
    items: ["MySQL", "MongoDB", "Redis", "Prisma", "Knex"],
  },
  {
    category: "Cloud & Platform",
    items: [
      "AWS S3",
      "AWS EC2",
      "AWS IAM",
      "Docker",
      "Docker Compose",
      "Linux",
      "SSH",
    ],
  },
  {
    category: "Quality & Workflow",
    items: ["Jest", "Vitest", "Unit Testing", "Git", "Jira", "Agile"],
  },
];

export const Arsenal = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} id="arsenal" className={styles.root}>
      <div className={styles.container}>
        <div data-animate>
          <SectionLabel number="03" title="Arsenal" />
        </div>
        <h2 className={styles.heading} data-animate>
          Weapons of Choice
        </h2>

        <div className={styles.groups}>
          {SKILLS.map(({ category, items }) => (
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
