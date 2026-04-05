export type Project = {
  title: string;
  description: string;
  tag: string;
  url: string;
  placeholder?: boolean;
};

export const projects: Project[] = [
  {
    title: "Hugo Docs",
    description: "Technical documentation and writing dojo",
    tag: "docs",
    url: "https://personal-hugo-docs.vercel.app/docs/",
  },
  {
    title: "Resume Site",
    description: "Multilingual resume built with Next.js",
    tag: "design",
    url: "https://resume-site-opal-phi.vercel.app/en/",
  },
  {
    title: "GitHub",
    description: "Clean public repositories and open source",
    tag: "oss",
    url: "https://github.com/",
  },
  {
    title: "More in the forge...",
    description: "New projects being forged",
    tag: "soon",
    url: "#",
    placeholder: true,
  },
];
