import { z } from "zod";

export const CONTACT_API_ERROR_CODE = {
  INVALID_REQUEST: "INVALID_REQUEST",
  FORBIDDEN_ORIGIN: "FORBIDDEN_ORIGIN",
  RATE_LIMITED: "RATE_LIMITED",
  DELIVERY_UNAVAILABLE: "DELIVERY_UNAVAILABLE",
} as const;

export type ContactApiErrorCode =
  (typeof CONTACT_API_ERROR_CODE)[keyof typeof CONTACT_API_ERROR_CODE];

export type ContactApiResponse =
  | { success: true }
  | {
      success: false;
      code: ContactApiErrorCode;
    };

export const CONTACT_DEFAULT_SUBJECT = "Portfolio Contact";

export const CONTACT_SUBJECT_OPTIONS = [
  CONTACT_DEFAULT_SUBJECT,
  "Hiring Inquiry",
  "Collaboration",
  "General",
] as const;

export const CONTACT_FIELD_LIMIT = {
  NAME_MAX: 80,
  EMAIL_MAX: 254,
  SUBJECT_MAX: 80,
  MESSAGE_MIN: 10,
  MESSAGE_MAX: 4000,
  BOTCHECK_MAX: 250,
} as const;

const trimmedString = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : ""),
  z.string(),
);

export const contactPayloadSchema = z
  .object({
    name: trimmedString.pipe(
      z.string().min(1).max(CONTACT_FIELD_LIMIT.NAME_MAX),
    ),
    email: trimmedString.pipe(
      z.string().min(1).max(CONTACT_FIELD_LIMIT.EMAIL_MAX).pipe(z.email()),
    ),
    subject: trimmedString
      .transform((value) => value || CONTACT_DEFAULT_SUBJECT)
      .pipe(z.enum(CONTACT_SUBJECT_OPTIONS)),
    message: trimmedString.pipe(
      z
        .string()
        .min(CONTACT_FIELD_LIMIT.MESSAGE_MIN)
        .max(CONTACT_FIELD_LIMIT.MESSAGE_MAX),
    ),
    botcheck: trimmedString.pipe(
      z.string().max(CONTACT_FIELD_LIMIT.BOTCHECK_MAX),
    ),
  })
  .strict();

export type ContactPayload = z.infer<typeof contactPayloadSchema>;
