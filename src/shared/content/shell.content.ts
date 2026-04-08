import type { NavLinkContent } from "./home.types";

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
    mobileNavigationLabel: string;
    openMenuLabel: string;
    closeMenuLabel: string;
  };
  footer: {
    brand: string;
    backToTopLabel: string;
    quote: string;
    copyrightName: string;
  };
}

export const shellContent = {
  nav: {
    brand: "anan",
    links: [
      { href: "#the-way", label: "The Way" },
      { href: "#arsenal", label: "Arsenal" },
      { href: "#forge", label: "Forge" },
      { href: "#contact", label: "Engagement" },
    ],
    sourceRepo: {
      href: "https://github.com/Anan-Saleh-1995/portfolio",
      label: "Source",
      ariaLabel: "View portfolio source on GitHub",
    },
    backToTopLabel: "Back to top",
    mainNavigationLabel: "Main navigation",
    mobileNavigationLabel: "Mobile navigation",
    openMenuLabel: "Open menu",
    closeMenuLabel: "Close menu",
  },
  footer: {
    brand: "anan",
    backToTopLabel: "Back to top",
    quote: '"Today is victory over yourself of yesterday."',
    copyrightName: "Anan Saleh",
  },
} satisfies ShellContent;
