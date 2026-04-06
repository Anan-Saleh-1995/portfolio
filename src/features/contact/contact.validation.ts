import type { ContactErrors } from "./contact.types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE_LENGTH = 10;

export const validateContactForm = (formData: FormData): ContactErrors => {
  const name = formData.get("name")?.toString().trim() || "";
  const email = formData.get("email")?.toString().trim() || "";
  const message = formData.get("message")?.toString().trim() || "";

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
