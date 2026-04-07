import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactApiErrorCode } from "@/shared/contracts/contact";

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
      errorMessage:
        "Your word could not be delivered. Try again or use a direct channel.",
      values: validFields,
      feedback: {
        kind: "error",
        title: "Delivery Faltered",
        message:
          "Your word could not be delivered. Try again or use a direct channel.",
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
          code: ContactApiErrorCode.RateLimited,
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
      errorMessage:
        "The channel is cooling. Try again in 24 hours or use a direct channel.",
      values: validFields,
      feedback: {
        kind: "warning",
        title: "The Gate Is Closed",
        message:
          "The channel is cooling. Try again in 24 hours or use a direct channel.",
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
        kind: "success",
        title: "Word Received",
        message:
          "Your message has been received. I will respond within 48 hours.",
      },
    });
  });
});
