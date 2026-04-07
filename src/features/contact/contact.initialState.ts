import type { ContactFormState } from "./contact.types";

export const initialContactFormState: ContactFormState = {
  success: false,
  errors: {},
  errorMessage: "",
  values: {
    name: "",
    email: "",
    subject: "",
    message: "",
  },
  feedback: null,
};
