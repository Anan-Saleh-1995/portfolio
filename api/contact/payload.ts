import type { ContactPayload } from "./types";
import { getTrimmedString } from "../shared/strings";

const DEFAULT_SUBJECT = "Portfolio Contact";

export const parsePayload = (body: unknown): ContactPayload | null => {
  if (typeof body !== "object" || body === null) {
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
    payload.name === "" ||
    payload.email === "" ||
    payload.subject === "" ||
    payload.message === ""
  ) {
    return null;
  }

  return payload;
};
