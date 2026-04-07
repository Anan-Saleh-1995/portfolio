import { afterEach, describe, expect, it, vi } from "vitest";

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
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("returns a delivery error when web3forms env config is missing", async () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "");
    vi.stubEnv("VITE_WEB3FORMS_MAIL_API", "");

    const { submitContactAction } = await import("./contact.action");

    const result = await submitContactAction(
      { success: false, errors: {}, errorMessage: "" },
      createFormData(validFields),
    );

    expect(result).toEqual({
      success: false,
      errors: {},
      errorMessage:
        "Your word could not be delivered. Try again or use a direct channel.",
    });
  });

  it("returns a delivery error when the mail endpoint responds with non-json content", async () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "public-key");
    vi.stubEnv("VITE_WEB3FORMS_MAIL_API", "https://api.example.com/contact");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        headers: new Headers({ "content-type": "text/html; charset=utf-8" }),
      }),
    );

    const { submitContactAction } = await import("./contact.action");

    const result = await submitContactAction(
      { success: false, errors: {}, errorMessage: "" },
      createFormData(validFields),
    );

    expect(result).toEqual({
      success: false,
      errors: {},
      errorMessage:
        "Your word could not be delivered. Try again or use a direct channel.",
    });
  });

  it("returns success when web3forms accepts the request", async () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "public-key");
    vi.stubEnv("VITE_WEB3FORMS_MAIL_API", "https://api.example.com/contact");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: vi.fn().mockResolvedValue({ success: true }),
      }),
    );

    const { submitContactAction } = await import("./contact.action");

    const result = await submitContactAction(
      { success: false, errors: {}, errorMessage: "" },
      createFormData(validFields),
    );

    expect(result).toEqual({
      success: true,
      errors: {},
      errorMessage: "",
    });
  });
});
