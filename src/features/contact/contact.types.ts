export interface ContactErrors {
  name?: string;
  email?: string;
  message?: string;
}

export interface ContactFormState {
  success: boolean;
  errors: ContactErrors;
  errorMessage: string;
}
