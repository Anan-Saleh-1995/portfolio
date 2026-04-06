import { validateContactForm } from "./contact.validation";
import type { ContactFormState } from "./contact.types";
import { getHomeContent } from "@/shared/i18n/getHomeContent";

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string;
const WEB3FORMS_MAIL_API = import.meta.env.VITE_WEB3FORMS_MAIL_API as string;

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
  const { delivery } = getHomeContent().contact.form;
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
      getStringField(formData, "subject") || delivery.defaultSubject,
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
        errorMessage: delivery.error,
      };
    }

    return {
      success: true,
      errors: {},
      errorMessage: "",
    };
  } catch (e) {
    console.log(e, WEB3FORMS_MAIL_API, WEB3FORMS_KEY);

    return {
      success: false,
      errors: {},
      errorMessage: delivery.error,
    };
  }
};
