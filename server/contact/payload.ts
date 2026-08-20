import type { ContactPayload } from "./types.js";
import { getTrimmedString } from "../shared/strings.js";

const DEFAULT_SUBJECT = "Portfolio Contact";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE_LENGTH = 10;
const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 80;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_BOTCHECK_LENGTH = 250;
const ALLOWED_SUBJECTS = new Set([
  DEFAULT_SUBJECT,
  "Hiring Inquiry",
  "Collaboration",
  "General",
]);

const hasValidLength = (value: string, min: number, max: number) =>
  value.length >= min && value.length <= max;

const isValidEmail = (email: string) =>
  email.length <= MAX_EMAIL_LENGTH && EMAIL_REGEX.test(email);

export const parsePayload = (body: unknown): ContactPayload | null => {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return null;
  }

  const candidate = body as Record<string, unknown>;

  const payload: ContactPayload = {
    name: getTrimmedString(candidate.name),
    email: getTrimmedString(candidate.email),
    subject: getTrimmedString(candidate.subject) || DEFAULT_SUBJECT,
    message: getTrimmedString(candidate.message),
    botcheck: getTrimmedString(candidate.botcheck),
  };

  if (
    !hasValidLength(payload.name, 1, MAX_NAME_LENGTH) ||
    !isValidEmail(payload.email) ||
    !ALLOWED_SUBJECTS.has(payload.subject) ||
    !hasValidLength(payload.subject, 1, MAX_SUBJECT_LENGTH) ||
    !hasValidLength(payload.message, MIN_MESSAGE_LENGTH, MAX_MESSAGE_LENGTH) ||
    payload.botcheck.length > MAX_BOTCHECK_LENGTH
  ) {
    return null;
  }

  return payload;
};
