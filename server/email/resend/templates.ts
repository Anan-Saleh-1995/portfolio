export const ResendTemplate = {
  DirectWord: "direct-word",
} as const;

export type ResendTemplate =
  (typeof ResendTemplate)[keyof typeof ResendTemplate];
