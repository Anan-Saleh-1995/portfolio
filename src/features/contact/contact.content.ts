export interface ContactFormContent {
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
    defaultSubject: string;
  };
}

export interface ContactContent {
  sectionNumber: string;
  sectionTitle: string;
  heading: string;
  subheading: string;
  channelsLabel: string;
  email: string;
  github: string;
  resume: string;
  form: ContactFormContent;
}

const contactFormContent = {
  labels: {
    name: "Name",
    email: "Email",
    purpose: "Purpose",
    message: "Message",
  },
  liveRegion: {
    pending: "Sending your message...",
  },
  submit: {
    idle: "Send Word",
    pending: "Sending...",
  },
  success: {
    heading: "Word Received",
    reset: "Send Another",
  },
  purposeSelect: {
    placeholder: "Select a purpose",
    ariaLabel: "Purpose",
    options: [
      { value: "Hiring Inquiry", label: "Hiring Inquiry" },
      { value: "Collaboration", label: "Collaboration" },
      { value: "General", label: "General" },
    ],
  },
  validation: {
    nameRequired: "State your name",
    emailRequired: "An email is required",
    emailInvalid: "Enter a valid email address",
    messageRequired: "State your message",
    messageTooShort: "Your message must be at least {min} characters",
  },
  delivery: {
    defaultSubject: "Portfolio Contact",
  },
} satisfies ContactFormContent;

export const contactContent = {
  sectionNumber: "05",
  sectionTitle: "Engagement",
  heading: "State Your Intent",
  subheading:
    "Opportunities, alliances, and worthy challenges are welcome. Send word.",
  channelsLabel: "Direct Channels",
  email: "anansaleh18@gmail.com",
  github: "https://github.com/Anan-Saleh-1995",
  resume: "https://resume-site-opal-phi.vercel.app/en/",
  form: contactFormContent,
} satisfies ContactContent;
