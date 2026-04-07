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
  kind: "success" | "error" | "warning";
  title: string;
  message: string;
}

export interface ContactFormState {
  success: boolean;
  errors: ContactErrors;
  errorMessage: string;
  values: ContactFormValues;
  feedback: ContactFormFeedback | null;
}
