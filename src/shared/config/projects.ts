type Project = {
  title: string;
  description: string;
  tag: string;
  url: string;
  placeholder?: boolean;
  private?: boolean;
};

export const projects: Project[] = [
  {
    title: "GitHub",
    description:
      "Public code, backend patterns, frontend experiments, and ongoing open-source work that show how I structure real projects.",
    tag: "oss",
    url: "https://github.com/Anan-Saleh-1995",
  },
  {
    title: "Hugo Docs",
    description:
      "Technical writing project focused on clear documentation, structured content, and maintainable docs architecture.",
    tag: "docs",
    url: "https://personal-hugo-docs.vercel.app/docs/",
  },
  {
    title: "Resume Site",
    description:
      "Multilingual resume site built with Hugo to present experience, technical depth, and bilingual content clearly in Hebrew and English.",
    tag: "design",
    url: "https://resume-site-opal-phi.vercel.app/en/",
  },
  {
    title: "Travel Platform",
    description:
      "Private multi-role travel platform with guide and traveler flows, MFA, secure S3 uploads, PayPal webhooks, Redis, and Docker-based monitoring.",
    tag: "wip",
    url: "#",
    private: true,
  },
];
