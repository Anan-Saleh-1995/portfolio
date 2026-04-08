import type { ContactFeedbackCode } from "./contact.feedback";

export interface ContactErrors {
  name?: string;
  email?: string;
  message?: string;
}

export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormFeedback {
  code: ContactFeedbackCode;
  kind: "success" | "error" | "warning";
}

export interface ContactFormState {
  success: boolean;
  errors: ContactErrors;
  errorMessage: string;
  values: ContactFormValues;
  feedback: ContactFormFeedback | null;
}
