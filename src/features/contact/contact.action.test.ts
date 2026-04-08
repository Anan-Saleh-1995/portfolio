import { afterEach, describe, expect, it, vi } from "vitest";
import { CONTACT_FEEDBACK_CODE } from "./contact.feedback";
import { CONTACT_API_ERROR_CODE } from "@/shared/contracts/contact";

const validFields = {
  name: "Anan",
  email: "anan@example.com",
  subject: "Portfolio Contact",
  message: "This is a valid contact message.",
};

const createFormData = (fields: Record<string, string>) => {
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    formData.set(key, value);
  });

  return formData;
};

describe("submitContactAction", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("returns a delivery error when the contact api responds with non-json content", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        headers: new Headers({ "content-type": "text/html; charset=utf-8" }),
        status: 502,
      }),
    );

    const { submitContactAction } = await import("./contact.action");

    const result = await submitContactAction(
      {
        success: false,
        errors: {},
        errorMessage: "",
        values: { name: "", email: "", subject: "", message: "" },
        feedback: null,
      },
      createFormData(validFields),
    );

    expect(result).toEqual({
      success: false,
      errors: {},
      errorMessage: "",
      values: validFields,
      feedback: {
        code: CONTACT_FEEDBACK_CODE.DELIVERY_FAILED,
        kind: "error",
      },
    });
  });

  it("returns a rate-limit error when the contact api responds with forbidden", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 403,
        ok: false,
        headers: new Headers({ "content-type": "application/json" }),
        json: vi.fn().mockResolvedValue({
          success: false,
          code: CONTACT_API_ERROR_CODE.RATE_LIMITED,
        }),
      }),
    );

    const { submitContactAction } = await import("./contact.action");

    const result = await submitContactAction(
      {
        success: false,
        errors: {},
        errorMessage: "",
        values: { name: "", email: "", subject: "", message: "" },
        feedback: null,
      },
      createFormData(validFields),
    );

    expect(result).toEqual({
      success: false,
      errors: {},
      errorMessage: "",
      values: validFields,
      feedback: {
        code: CONTACT_FEEDBACK_CODE.RATE_LIMITED,
        kind: "warning",
      },
    });
  });

  it("returns success when the contact api accepts the request", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: vi.fn().mockResolvedValue({ success: true }),
        status: 200,
      }),
    );

    const { submitContactAction } = await import("./contact.action");

    const result = await submitContactAction(
      {
        success: false,
        errors: {},
        errorMessage: "",
        values: { name: "", email: "", subject: "", message: "" },
        feedback: null,
      },
      createFormData(validFields),
    );

    expect(result).toEqual({
      success: true,
      errors: {},
      errorMessage: "",
      values: { name: "", email: "", subject: "", message: "" },
      feedback: {
        code: CONTACT_FEEDBACK_CODE.DELIVERY_SUCCEEDED,
        kind: "success",
      },
    });
  });
});
