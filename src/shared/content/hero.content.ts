import type { NavLinkContent } from "./home.types";

export interface HeroContent {
  sectionNumber: string;
  sectionTitle: string;
  title: string;
  subtitle: string;
  role: string;
  primaryCta: NavLinkContent;
  secondaryCta: NavLinkContent;
  scrollCueLabel: string;
}

export const heroContent = {
  sectionNumber: "01",
  sectionTitle: "Enter",
  title: "The Dojo",
  subtitle: "Mastery through discipline.",
  role: "Full-Stack Developer",
  primaryCta: { href: "#the-way", label: "Explore" },
  secondaryCta: {
    href: "https://github.com/Anan-Saleh-1995",
    label: "GitHub",
  },
  scrollCueLabel: "Scroll down",
} satisfies HeroContent;
