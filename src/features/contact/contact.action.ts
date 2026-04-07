import { validateContactForm } from "./contact.validation";
import type { ContactFormState } from "./contact.types";
import { getHomeContent } from "@/shared/i18n/getHomeContent";

interface Web3FormsResponse {
  success?: boolean;
}

const getStringField = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
};

const isWeb3FormsResponse = (value: unknown): value is Web3FormsResponse =>
  typeof value === "object" && value !== null && "success" in value;

const getEnvString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const getWeb3FormsConfig = () => {
  const accessKey = getEnvString(import.meta.env.VITE_WEB3FORMS_KEY);
  const endpoint = getEnvString(import.meta.env.VITE_WEB3FORMS_MAIL_API);

  if (accessKey === "" || endpoint === "") {
    return null;
  }

  return {
    accessKey,
    endpoint,
  };
};

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

  const config = getWeb3FormsConfig();

  if (!config) {
    return failureState;
  }

  try {
    const body = new FormData();
    body.append("access_key", config.accessKey);
    body.append("name", getStringField(formData, "name"));
    body.append("email", getStringField(formData, "email"));
    body.append(
      "subject",
      getStringField(formData, "subject") || delivery.defaultSubject,
    );
    body.append("message", getStringField(formData, "message"));
    body.append("botcheck", "");

    console.log({
      route: "web3forms",
      hasKey: config.accessKey,
      endpoint: config.endpoint,
    });

    const res = await fetch(config.endpoint, {
      method: "POST",
      body,
    });

    const contentType = res.headers.get("content-type");

    console.log({
      route: "web3forms",
      hasKey: config.accessKey !== "",
      endpoint: config.endpoint,
      status: res.status,
      contentType,
    });

    if (!res.ok || !contentType?.includes("application/json")) {
      return failureState;
    }

    const data: unknown = await res.json();

    console.log({
      route: "web3forms",
      success: isWeb3FormsResponse(data) ? data.success === true : false,
    });

    if (!isWeb3FormsResponse(data) || data.success !== true) {
      return failureState;
    }

    return {
      success: true,
      errors: {},
      errorMessage: "",
    };
  } catch {
    console.log({
      route: "web3forms",
      error: "request_failed",
      endpoint: config.endpoint,
    });

    return failureState;
  }
};
