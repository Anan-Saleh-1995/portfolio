export const EmailProvider = {
  Resend: "resend",
} as const;

export type EmailProvider = (typeof EmailProvider)[keyof typeof EmailProvider];
