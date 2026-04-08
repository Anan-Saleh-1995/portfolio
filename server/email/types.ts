export const SEND_EMAIL_RESULT = {
  SENT: "sent",
  MISSING_CONFIG: "missing_config",
  FAILED: "failed",
} as const;

export type SendEmailResult =
  (typeof SEND_EMAIL_RESULT)[keyof typeof SEND_EMAIL_RESULT];
