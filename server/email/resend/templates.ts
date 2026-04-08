export const RESEND_TEMPLATE = {
  DIRECT_WORD: "direct-word",
} as const;

export type ResendTemplate =
  (typeof RESEND_TEMPLATE)[keyof typeof RESEND_TEMPLATE];
