import { describe, expect, it } from "vitest";
import { CONTACT_DEFAULT_SUBJECT } from "../../shared/contact.js";
import { parsePayload } from "./payload.js";

describe("parsePayload", () => {
  it("returns a trimmed payload and default subject", () => {
    expect(
      parsePayload({
        name: " Anan ",
        email: " anan@example.com ",
        message: " This is a valid contact message. ",
        botcheck: "",
      }),
    ).toEqual({
      name: "Anan",
      email: "anan@example.com",
      subject: CONTACT_DEFAULT_SUBJECT,
      message: "This is a valid contact message.",
      botcheck: "",
    });
  });

  it("rejects invalid email addresses", () => {
    expect(
      parsePayload({
        name: "Anan",
        email: "invalid",
        subject: "Hiring Inquiry",
        message: "This is a valid contact message.",
        botcheck: "",
      }),
    ).toBeNull();
  });

  it("rejects unsupported subjects", () => {
    expect(
      parsePayload({
        name: "Anan",
        email: "anan@example.com",
        subject: "Injected subject",
        message: "This is a valid contact message.",
        botcheck: "",
      }),
    ).toBeNull();
  });

  it("rejects extra fields", () => {
    expect(
      parsePayload({
        name: "Anan",
        email: "anan@example.com",
        subject: "Hiring Inquiry",
        message: "This is a valid contact message.",
        botcheck: "",
        admin: true,
      }),
    ).toBeNull();
  });
});
