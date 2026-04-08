export const CONTACT_FEEDBACK_CODE = {
  DELIVERY_FAILED: "DELIVERY_FAILED",
  RATE_LIMITED: "RATE_LIMITED",
  DELIVERY_SUCCEEDED: "DELIVERY_SUCCEEDED",
} as const;

export type ContactFeedbackCode =
  (typeof CONTACT_FEEDBACK_CODE)[keyof typeof CONTACT_FEEDBACK_CODE];

export const CONTACT_FEEDBACK_KIND = {
  DELIVERY_FAILED: "error",
  RATE_LIMITED: "warning",
  DELIVERY_SUCCEEDED: "success",
} as const;

export const CONTACT_FEEDBACK_TITLE = {
  DELIVERY_FAILED: "Delivery Faltered",
  RATE_LIMITED: "The Gate Is Closed",
  DELIVERY_SUCCEEDED: "Word Received",
} as const;

export const CONTACT_FEEDBACK_MESSAGE = {
  DELIVERY_FAILED:
    "Your word could not be delivered. Try again or use a direct channel.",
  RATE_LIMITED:
    "The channel is cooling. Try again in 24 hours or use a direct channel.",
  DELIVERY_SUCCEEDED:
    "Your message has been received. I will respond within 48 hours.",
} as const;
