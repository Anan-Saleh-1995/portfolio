export const SendEmailResult = {
  Sent: "sent",
  MissingConfig: "missing_config",
  Failed: "failed",
} as const;

export type SendEmailResult =
  (typeof SendEmailResult)[keyof typeof SendEmailResult];
