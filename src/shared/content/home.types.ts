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
}

export interface HomeContent {
  nav: {
    brand: string;
    links: NavLinkContent[];
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
    form: {
      labels: {
        name: string;
        email: string;
        purpose: string;
        message: string;
      };
      liveRegion: {
        pending: string;
      };
      submit: {
        idle: string;
        pending: string;
      };
      success: {
        heading: string;
        message: string;
        reset: string;
      };
      purposeSelect: {
        placeholder: string;
        ariaLabel: string;
        options: { value: string; label: string }[];
      };
      validation: {
        nameRequired: string;
        emailRequired: string;
        emailInvalid: string;
        messageRequired: string;
        messageTooShort: string;
      };
      delivery: {
        error: string;
        defaultSubject: string;
      };
    };
  };
  footer: {
    brand: string;
    backToTopLabel: string;
    quote: string;
    copyrightName: string;
  };
}
