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
    items: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Vite"],
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
    items: [
      "Jest",
      "Vitest",
      "Supertest",
      "Integration Testing",
      "Git",
      "Jira",
      "Agile",
    ],
  },
];

export const Arsenal = () => (
  <section id="arsenal" className={styles.root}>
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
