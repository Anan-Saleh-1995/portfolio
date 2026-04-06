import type { ContactErrors } from "./contact.types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE_LENGTH = 10;

const getStringField = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
};

export const validateContactForm = (formData: FormData): ContactErrors => {
  const name = getStringField(formData, "name");
  const email = getStringField(formData, "email");
  const message = getStringField(formData, "message");

  const errors: ContactErrors = {};

  if (!name) errors.name = "State your name";

  if (!email) {
    errors.email = "An email is required";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Enter a valid email address";
  }

  if (!message) {
    errors.message = "State your message";
  } else if (message.length < MIN_MESSAGE_LENGTH) {
    errors.message = `Your message must be at least ${MIN_MESSAGE_LENGTH} characters`;
  }

  return errors;
};
