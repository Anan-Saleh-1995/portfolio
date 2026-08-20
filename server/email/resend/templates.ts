import type { ContactPayload } from "../../contact/types.js";

export const DEFAULT_RESEND_CONTACT_TEMPLATE_ID = "direct-word";

export const createContactEmailTemplate = (
  templateId: string,
  payload: ContactPayload,
) =>
  ({
    id: templateId,
    variables: {
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message,
    },
  }) as const;
