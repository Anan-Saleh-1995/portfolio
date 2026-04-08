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
    rateLimited: string;
    defaultSubject: string;
  };
  toast: {
    successTitle: string;
    errorTitle: string;
    rateLimitedTitle: string;
  };
}

export const contactFormContent = {
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
    message: "Your message has been received. I will respond within 48 hours.",
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
    error:
      "Your word could not be delivered. Try again or use a direct channel.",
    rateLimited:
      "The channel is cooling. Try again in 24 hours or use a direct channel.",
    defaultSubject: "Portfolio Contact",
  },
  toast: {
    successTitle: "Word Received",
    errorTitle: "Delivery Faltered",
    rateLimitedTitle: "The Gate Is Closed",
  },
} satisfies ContactFormContent;
