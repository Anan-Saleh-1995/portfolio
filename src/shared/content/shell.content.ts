import type { NavLinkContent } from "./home.types";

export type SocialBrand = "github" | "bluesky" | "mastodon";

export interface SocialProfileContent {
  brand: SocialBrand;
  label: string;
  href?: string;
}

const socialProfiles: SocialProfileContent[] = [
  {
    brand: "github",
    label: "GitHub",
    href: "https://github.com/Anan-Saleh-1995",
  },
  { brand: "bluesky", label: "Bluesky" },
  { brand: "mastodon", label: "Mastodon" },
];

export interface ShellContent {
  nav: {
    brand: string;
    links: NavLinkContent[];
    sourceRepo: {
      href: string;
      label: string;
      ariaLabel: string;
    };
    backToTopLabel: string;
    mainNavigationLabel: string;
    chapterNavigationLabel: string;
    menuIntroduction: string;
    mobileNavigationLabel: string;
    openMenuLabel: string;
    closeMenuLabel: string;
  };
  footer: {
    brand: string;
    backToTopLabel: string;
    quote: string;
    copyrightName: string;
    heading: string;
    description: string;
    chaptersLabel: string;
    destinationsLabel: string;
    socialLabel: string;
    profileSoonLabel: string;
    socialProfiles: SocialProfileContent[];
    destinations: {
      href: string;
      label: string;
      description: string;
    }[];
  };
}

export const shellContent = {
  nav: {
    brand: "anan",
    links: [
      { href: "#forge", label: "Work" },
      { href: "#the-way", label: "The Way" },
      { href: "#arsenal", label: "Arsenal" },
      { href: "#contact", label: "Contact" },
    ],
    sourceRepo: {
      href: "https://github.com/Anan-Saleh-1995/portfolio",
      label: "View source",
      ariaLabel: "View portfolio source on GitHub",
    },
    backToTopLabel: "Back to top",
    mainNavigationLabel: "Main navigation",
    chapterNavigationLabel: "Explore the chapters",
    menuIntroduction: "The story, the work, and the thinking behind it.",
    mobileNavigationLabel: "Mobile navigation",
    openMenuLabel: "Open menu",
    closeMenuLabel: "Close menu",
  },
  footer: {
    brand: "anan",
    backToTopLabel: "Back to top",
    quote: '"Today is victory over yourself of yesterday."',
    copyrightName: "Anan Saleh",
    heading: "The path continues.",
    description:
      "One portfolio, several ways to explore. Follow the work into the code, the notes, or the experience behind it.",
    chaptersLabel: "In this portfolio",
    destinationsLabel: "Go a little deeper",
    socialLabel: "Find me elsewhere",
    profileSoonLabel: "Profile soon",
    socialProfiles,
    destinations: [
      {
        href: "https://personal-hugo-docs.vercel.app/docs/",
        label: "Dev docs",
        description: "Follow the notes, patterns, and technical thinking.",
      },
      {
        href: "https://resume-site-opal-phi.vercel.app/en/",
        label: "Resume",
        description: "Read the experience behind the work.",
      },
    ],
  },
} satisfies ShellContent;
