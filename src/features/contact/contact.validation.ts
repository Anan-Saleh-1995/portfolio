import type { ContactErrors } from "./contact.types";
import { homeContent } from "@/shared/content/en/home";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE_LENGTH = 10;

const getStringField = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
};

export const validateContactForm = (formData: FormData): ContactErrors => {
  const { validation } = homeContent.contact.form;
  const name = getStringField(formData, "name");
  const email = getStringField(formData, "email");
  const message = getStringField(formData, "message");

  const errors: ContactErrors = {};

  if (!name) errors.name = validation.nameRequired;

  if (!email) {
    errors.email = validation.emailRequired;
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = validation.emailInvalid;
  }

  if (!message) {
    errors.message = validation.messageRequired;
  } else if (message.length < MIN_MESSAGE_LENGTH) {
    errors.message = validation.messageTooShort.replace(
      "{min}",
      String(MIN_MESSAGE_LENGTH),
    );
  }

  return errors;
};
