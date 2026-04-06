export type ContactErrors = {
  name?: string;
  email?: string;
  message?: string;
};

export type ContactFormState = {
  success: boolean;
  errors: ContactErrors;
  errorMessage: string;
};
