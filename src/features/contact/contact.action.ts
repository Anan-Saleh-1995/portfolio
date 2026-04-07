import { validateContactForm } from "./contact.validation";
import type { ContactFormState } from "./contact.types";
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

export const submitContactAction = async (
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> => {
  const { delivery } = getHomeContent().contact.form;
  const errors = validateContactForm(formData);
  const failureState: ContactFormState = {
    success: false,
    errors: {},
    errorMessage: delivery.error,
  };

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      errorMessage: "",
    };
  }

  if (formData.get("botcheck")) {
    return {
      success: true,
      errors: {},
      errorMessage: "",
    };
  }

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: getStringField(formData, "name"),
        email: getStringField(formData, "email"),
        subject: getStringField(formData, "subject") || delivery.defaultSubject,
        message: getStringField(formData, "message"),
        botcheck: "",
      }),
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
    };
  } catch {
    return failureState;
  }
};
