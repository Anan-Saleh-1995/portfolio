import type { ContactContent } from "@/features/contact/contact.content";
import type { HeroContent } from "./hero.content";
import type { ShellContent } from "./shell.content";

export interface NavLinkContent {
  href: string;
  label: string;
}

export interface ProjectContent {
  title: string;
  description: string;
  tag: string;
  url: string;
  placeholder?: boolean;
  private?: boolean;
  statusLabel?: string;
}

export interface HomeContent {
  nav: ShellContent["nav"];
  hero: HeroContent;
  theWay: {
    sectionNumber: string;
    sectionTitle: string;
    heading: string;
    paragraphs: string[];
    stats: { value: string; label: string }[];
    resume: NavLinkContent;
  };
  arsenal: {
    sectionNumber: string;
    sectionTitle: string;
    heading: string;
    groups: {
      category: string;
      items: string[];
    }[];
  };
  forge: {
    sectionNumber: string;
    sectionTitle: string;
    heading: string;
    projects: ProjectContent[];
  };
  provingGround: {
    sectionNumber: string;
    sectionTitle: string;
    heading: string;
    subheading: string;
    statusNote: string;
    note: string;
    problem: string;
    role: string;
    stack: string[];
    constraints: string;
    systems: string[];
    proofPoints: { value: string; label: string }[];
    decisions: {
      heading: string;
      items: string[];
    };
    impact: string;
  };
  contact: {
    sectionNumber: ContactContent["sectionNumber"];
    sectionTitle: ContactContent["sectionTitle"];
    heading: ContactContent["heading"];
    subheading: ContactContent["subheading"];
    channelsLabel: ContactContent["channelsLabel"];
    email: ContactContent["email"];
    github: ContactContent["github"];
    resume: ContactContent["resume"];
    form: ContactContent["form"];
  };
  footer: ShellContent["footer"];
}
