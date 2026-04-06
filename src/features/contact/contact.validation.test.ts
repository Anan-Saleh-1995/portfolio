import { describe, expect, it } from "vitest";
import { validateContactForm } from "./contact.validation";

const createFormData = (fields: Record<string, string>) => {
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    formData.set(key, value);
  });

  return formData;
};

describe("validateContactForm", () => {
  it("returns errors for missing required fields", () => {
    const formData = createFormData({
      name: "",
      email: "",
      message: "",
    });

    expect(validateContactForm(formData)).toEqual({
      name: "State your name",
      email: "An email is required",
      message: "State your message",
    });
  });

  it("returns no errors for a valid submission", () => {
    const formData = createFormData({
      name: "Anan",
      email: "anan@example.com",
      message: "This is a valid message.",
    });

    expect(validateContactForm(formData)).toEqual({});
  });

  it("returns an error for an invalid email", () => {
    const formData = createFormData({
      name: "Anan",
      email: "invalid",
      message: "This is a valid message.",
    });

    expect(validateContactForm(formData)).toEqual({
      email: "Enter a valid email address",
    });
  });
});
