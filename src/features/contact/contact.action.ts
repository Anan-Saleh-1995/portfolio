import { validateContactForm } from "./contact.validation";
import type { ContactFormState } from "./contact.types";

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string;
const WEB3FORMS_MAIL_API = import.meta.env.VITE_WEB3FORMS_MAIL_API as string;
const DELIVERY_ERROR =
  "Your word could not be delivered. Try again or use a direct channel.";

interface Web3FormsResponse {
  success?: boolean;
}

const getStringField = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
};

const isWeb3FormsResponse = (value: unknown): value is Web3FormsResponse =>
  typeof value === "object" && value !== null && "success" in value;

export const submitContactAction = async (
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> => {
  const errors = validateContactForm(formData);

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
    const body = new FormData();
    body.append("access_key", WEB3FORMS_KEY);
    body.append("name", getStringField(formData, "name"));
    body.append("email", getStringField(formData, "email"));
    body.append(
      "subject",
      getStringField(formData, "subject") || "Portfolio Contact",
    );
    body.append("message", getStringField(formData, "message"));
    body.append("botcheck", "");

    const res = await fetch(WEB3FORMS_MAIL_API, {
      method: "POST",
      body,
    });

    const data: unknown = await res.json();

    if (!isWeb3FormsResponse(data) || data.success !== true) {
      return {
        success: false,
        errors: {},
        errorMessage: DELIVERY_ERROR,
      };
    }

    return {
      success: true,
      errors: {},
      errorMessage: "",
    };
  } catch {
    return {
      success: false,
      errors: {},
      errorMessage: DELIVERY_ERROR,
    };
  }
};
