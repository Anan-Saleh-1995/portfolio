import type { HomeContent } from "./home.types";
import { contactContent } from "@/features/contact/contact.content";
import { heroContent } from "./hero.content";
import { shellContent } from "./shell.content";

export const homeContent: HomeContent = {
  nav: shellContent.nav,
  hero: heroContent,
  theWay: {
    sectionNumber: "03",
    sectionTitle: "The Way",
    heading: "The Way",
    paragraphs: [
      "Full-stack developer with 3+ years delivering production features in professional teams. Now independently building applications, contributing to other projects, and developing Learning Space toward a public launch.",
      "My professional work spans React, Meteor, Node.js, MongoDB, and AWS. I built secure S3 upload flows, 2FA and passwordless login systems, role-based access strategies, and cron-driven sitemap automation. Improved responsiveness on data-heavy screens by moving pagination to the server.",
      "My current projects explore mobile applications, native encryption bridges, testnet wallets, commerce, developer tooling, and technical publishing. Each is a place to work through a different product or engineering question.",
    ],
    stats: [{ value: "5", label: "Years building software" }],
    resume: {
      href: "https://resume-site-opal-phi.vercel.app/en/",
      label: "Read my résumé",
    },
  },
  arsenal: {
    sectionNumber: "04",
    sectionTitle: "Arsenal",
    heading: "The right tool. The right reason.",
  },
  contact: contactContent,
  footer: shellContent.footer,
};
