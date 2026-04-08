import type { ContactFormContent } from "@/features/contact/contact.content";

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
  hero: {
    sectionNumber: string;
    sectionTitle: string;
    title: string;
    subtitle: string;
    role: string;
    primaryCta: NavLinkContent;
    secondaryCta: NavLinkContent;
    scrollCueLabel: string;
  };
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
    sectionNumber: string;
    sectionTitle: string;
    heading: string;
    subheading: string;
    channelsLabel: string;
    email: string;
    github: string;
    form: ContactFormContent;
  };
  footer: {
    brand: string;
    backToTopLabel: string;
    quote: string;
    copyrightName: string;
  };
}
