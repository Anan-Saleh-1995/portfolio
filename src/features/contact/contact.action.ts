import { validateContactForm } from "./contact.validation";
import type { ContactFormState, ContactFormValues } from "./contact.types";
import { getHomeContent } from "@/shared/i18n/getHomeContent";

interface ContactApiResponse {
  success?: boolean;
}

const getStringField = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
};

const isContactApiResponse = (value: unknown): value is ContactApiResponse =>
  typeof value === "object" && value !== null && "success" in value;

const getFormValues = (
  formData: FormData,
  defaultSubject: string,
): ContactFormValues => ({
  name: getStringField(formData, "name"),
  email: getStringField(formData, "email"),
  subject: getStringField(formData, "subject") || defaultSubject,
  message: getStringField(formData, "message"),
});

export const submitContactAction = async (
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> => {
  const { delivery } = getHomeContent().contact.form;
  const values = getFormValues(formData, delivery.defaultSubject);
  const errors = validateContactForm(formData);
  const failureState: ContactFormState = {
    success: false,
    errors: {},
    errorMessage: delivery.error,
    values,
  };

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      errorMessage: "",
      values,
    };
  }

  if (formData.get("botcheck")) {
    return {
      success: true,
      errors: {},
      errorMessage: "",
      values: {
        name: "",
        email: "",
        subject: "",
        message: "",
      },
    };
  }

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values, botcheck: "" }),
    });

    const contentType = res.headers.get("content-type");

    if (!res.ok || !contentType?.includes("application/json")) {
      return failureState;
    }

    const data: unknown = await res.json();

    if (!isContactApiResponse(data) || data.success !== true) {
      return failureState;
    }

    return {
      success: true,
      errors: {},
      errorMessage: "",
      values: {
        name: "",
        email: "",
        subject: "",
        message: "",
      },
    };
  } catch {
    return failureState;
  }
};
