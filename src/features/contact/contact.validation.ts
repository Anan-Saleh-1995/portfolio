import type { ContactErrors } from "./contact.types";
import {
  CONTACT_DEFAULT_SUBJECT,
  CONTACT_FIELD_LIMIT,
  contactPayloadSchema,
} from "@/shared/contracts/contact";
import { getHomeContent } from "@/shared/i18n/getHomeContent";

const getStringField = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
};

const hasIssueForField = (
  result: ReturnType<typeof contactPayloadSchema.safeParse>,
  field: keyof ContactErrors,
) =>
  !result.success &&
  result.error.issues.some((issue) => issue.path[0] === field);

export const validateContactForm = (formData: FormData): ContactErrors => {
  const { validation } = getHomeContent().contact.form;
  const name = getStringField(formData, "name");
  const email = getStringField(formData, "email");
  const subject =
    getStringField(formData, "subject") || CONTACT_DEFAULT_SUBJECT;
  const message = getStringField(formData, "message");
  const result = contactPayloadSchema.safeParse({
    name,
    email,
    subject,
    message,
    botcheck: "",
  });

  const errors: ContactErrors = {};

  if (hasIssueForField(result, "name")) {
    errors.name = validation.nameRequired;
  }

  if (hasIssueForField(result, "email")) {
    errors.email =
      email === "" ? validation.emailRequired : validation.emailInvalid;
  }

  if (hasIssueForField(result, "message")) {
    if (message === "") {
      errors.message = validation.messageRequired;
    } else if (message.length < CONTACT_FIELD_LIMIT.MESSAGE_MIN) {
      errors.message = validation.messageTooShort.replace(
        "{min}",
        String(CONTACT_FIELD_LIMIT.MESSAGE_MIN),
      );
    } else {
      errors.message = validation.messageRequired;
    }
  }

  return errors;
};
