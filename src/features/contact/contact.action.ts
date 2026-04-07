import {
  ContactApiErrorCode,
  type ContactApiResponse,
} from "@/shared/contracts/contact";
import { isString } from "@/shared/lib/isString";
import { validateContactForm } from "./contact.validation";
import type {
  ContactFormFeedback,
  ContactFormState,
  ContactFormValues,
} from "./contact.types";
import { getHomeContent } from "@/shared/i18n/getHomeContent";

const getStringField = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return isString(value) ? value.trim() : "";
};

const isContactApiResponse = (value: unknown): value is ContactApiResponse =>
  typeof value === "object" &&
  value !== null &&
  "success" in value &&
  typeof value.success === "boolean";

const getFormValues = (
  formData: FormData,
  defaultSubject: string,
): ContactFormValues => ({
  name: getStringField(formData, "name"),
  email: getStringField(formData, "email"),
  subject: getStringField(formData, "subject") || defaultSubject,
  message: getStringField(formData, "message"),
});

const emptyValues: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const createFeedback = (
  kind: ContactFormFeedback["kind"],
  title: string,
  message: string,
): ContactFormFeedback => ({
  kind,
  title,
  message,
});

export const submitContactAction = async (
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> => {
  const { delivery, success, toast } = getHomeContent().contact.form;
  const values = getFormValues(formData, delivery.defaultSubject);
  const errors = validateContactForm(formData);
  const failureState: ContactFormState = {
    success: false,
    errors: {},
    errorMessage: delivery.error,
    values,
    feedback: createFeedback("error", toast.errorTitle, delivery.error),
  };

  const rateLimitedState: ContactFormState = {
    success: false,
    errors: {},
    errorMessage: delivery.rateLimited,
    values,
    feedback: createFeedback(
      "warning",
      toast.rateLimitedTitle,
      delivery.rateLimited,
    ),
  };

  const getFailureStateFromCode = (
    code: ContactApiErrorCode | undefined,
  ): ContactFormState => {
    if (code === ContactApiErrorCode.RateLimited) {
      return rateLimitedState;
    }

    return failureState;
  };

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      errorMessage: "",
      values,
      feedback: null,
    };
  }

  if (formData.get("botcheck")) {
    return {
      success: true,
      errors: {},
      errorMessage: "",
      values: emptyValues,
      feedback: null,
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

    if (!contentType?.includes("application/json")) {
      return failureState;
    }

    const data: unknown = await res.json();

    if (!isContactApiResponse(data)) {
      return failureState;
    }

    if (data.success !== true) {
      return getFailureStateFromCode(data.code);
    }

    if (!res.ok) {
      return failureState;
    }

    return {
      success: true,
      errors: {},
      errorMessage: "",
      values: emptyValues,
      feedback: createFeedback("success", toast.successTitle, success.message),
    };
  } catch {
    return failureState;
  }
};
