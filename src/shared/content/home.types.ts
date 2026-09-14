import type { ContactContent } from "@/features/contact/contact.content";
import type { HeroContent } from "./hero.content";
import type { ShellContent } from "./shell.content";

export interface NavLinkContent {
  href: string;
  label: string;
}

interface SectionContent {
  sectionNumber: string;
  sectionTitle: string;
  heading: string;
}

export interface HomeContent {
  nav: ShellContent["nav"];
  hero: HeroContent;
  theWay: SectionContent & {
    paragraphs: string[];
    stats: { value: string; label: string }[];
    resume: NavLinkContent;
  };
  arsenal: SectionContent;
  contact: ContactContent;
  footer: ShellContent["footer"];
}
