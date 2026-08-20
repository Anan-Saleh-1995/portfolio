import {
  contactPayloadSchema,
  type ContactPayload,
} from "../../shared/contact.js";

export const parsePayload = (body: unknown): ContactPayload | null => {
  const result = contactPayloadSchema.safeParse(body);
  return result.success ? result.data : null;
};
