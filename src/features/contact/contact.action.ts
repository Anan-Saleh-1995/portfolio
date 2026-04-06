import { validateContactForm } from "./contact.validation";
import type { ContactFormState } from "./contact.types";

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string;
const WEB3FORMS_MAIL_API = import.meta.env.VITE_WEB3FORMS_MAIL_API as string;

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
    body.append("name", formData.get("name")?.toString().trim() || "");
    body.append("email", formData.get("email")?.toString().trim() || "");
    body.append(
      "subject",
      formData.get("subject")?.toString() || "Portfolio Contact",
    );
    body.append("message", formData.get("message")?.toString().trim() || "");
    body.append("botcheck", "");

    const res = await fetch(WEB3FORMS_MAIL_API, {
      method: "POST",
      body,
    });

    const data = await res.json();

    if (!data.success) {
      return {
        success: false,
        errors: {},
        errorMessage:
          "Your word could not be delivered. Try again or use a direct channel.",
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
      errorMessage:
        "Your word could not be delivered. Try again or use a direct channel.",
    };
  }
};
