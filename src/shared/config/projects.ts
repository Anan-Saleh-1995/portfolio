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
    description: "Clean public repositories and open source contributions.",
    tag: "oss",
    url: "https://github.com/Anan-Saleh-1995",
  },
  {
    title: "Hugo Docs",
    description: "Technical documentation and writing dojo.",
    tag: "docs",
    url: "https://personal-hugo-docs.vercel.app/docs/",
  },
  {
    title: "Resume Site",
    description: "Multilingual resume built with Hugo — Hebrew, English.",
    tag: "design",
    url: "https://resume-site-opal-phi.vercel.app/en/",
  },
  {
    title: "Travel Platform",
    description:
      "Multi-role travel platform — Node.js, MySQL, Redis, MFA, S3 uploads, PayPal webhooks, Prometheus/Grafana.",
    tag: "wip",
    url: "#",
    private: true,
  },
];
