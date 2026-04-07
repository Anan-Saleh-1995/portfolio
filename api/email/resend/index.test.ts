import { afterEach, describe, expect, it, vi } from "vitest";

const { sendEmail, MockResend } = vi.hoisted(() => {
  interface ResendSendResult {
    data: { id: string } | null;
    error: { message: string } | null;
  }

  interface ResendEmailPayload {
    from: string;
    to: string;
    replyTo: string;
    subject: string;
    template: {
      id: string;
      variables: {
        name: string;
        email: string;
        subject: string;
        message: string;
      };
    };
  }

  const sendEmail =
    vi.fn<(payload: ResendEmailPayload) => Promise<ResendSendResult>>();
  const MockResend = vi.fn().mockImplementation(function MockResend() {
    return {
      emails: {
        send: sendEmail,
      },
    };
  });

  return { sendEmail, MockResend };
});

vi.mock("resend", () => ({
  Resend: MockResend,
}));

import { resetResendClient } from "./client";
import { resetEmailConfig } from "./config";
import { sendContactEmail } from "./index";
import { SendEmailResult } from "../types";
import { resetServerEnv } from "../../shared/env";

describe("sendContactEmail", () => {
  afterEach(() => {
    sendEmail.mockReset();
    MockResend.mockClear();
    resetEmailConfig();
    resetResendClient();
    resetServerEnv();
    vi.unstubAllEnvs();
  });

  it("returns missing_config when env vars are absent", async () => {
    const result = await sendContactEmail({
      name: "Anan",
      email: "anan@example.com",
      subject: "Hiring Inquiry",
      message: "This is a valid contact message.",
      botcheck: "",
    });

    expect(result).toBe(SendEmailResult.MissingConfig);
  });

  it("returns failed when resend rejects the email", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("RESEND_FROM_EMAIL", "Portfolio <contact@send.anansaleh.com>");
    vi.stubEnv("CONTACT_TO_EMAIL", "anansaleh18@gmail.com");
    sendEmail.mockResolvedValue({
      data: null,
      error: { message: "blocked" },
    });

    const result = await sendContactEmail({
      name: "Anan",
      email: "anan@example.com",
      subject: "Hiring Inquiry",
      message: "This is a valid contact message.",
      botcheck: "",
    });

    expect(result).toBe(SendEmailResult.Failed);
  });

  it("returns sent when resend accepts the email", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("RESEND_FROM_EMAIL", "Portfolio <contact@send.anansaleh.com>");
    vi.stubEnv("CONTACT_TO_EMAIL", "anansaleh18@gmail.com");
    sendEmail.mockResolvedValue({
      data: { id: "email_123" },
      error: null,
    });

    const result = await sendContactEmail({
      name: "Anan",
      email: "anan@example.com",
      subject: "Hiring Inquiry",
      message: "This is a valid contact message.",
      botcheck: "",
    });

    expect(result).toBe(SendEmailResult.Sent);
    expect(MockResend).toHaveBeenCalledTimes(1);
    const firstArg = sendEmail.mock.calls.at(0)?.at(0);

    expect(firstArg).toMatchObject({
      from: "Portfolio <contact@send.anansaleh.com>",
      to: "anansaleh18@gmail.com",
      replyTo: "anan@example.com",
      subject: "Hiring Inquiry",
      template: {
        id: "direct-word",
      },
    });
    expect(firstArg?.template.variables).toEqual({
      name: "Anan",
      email: "anan@example.com",
      subject: "Hiring Inquiry",
      message: "This is a valid contact message.",
    });
  });

  it("reuses the configured resend client", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("RESEND_FROM_EMAIL", "Portfolio <contact@send.anansaleh.com>");
    vi.stubEnv("CONTACT_TO_EMAIL", "anansaleh18@gmail.com");
    sendEmail.mockResolvedValue({
      data: { id: "email_123" },
      error: null,
    });

    await sendContactEmail({
      name: "Anan",
      email: "anan@example.com",
      subject: "Hiring Inquiry",
      message: "First message body",
      botcheck: "",
    });

    await sendContactEmail({
      name: "Anan",
      email: "anan@example.com",
      subject: "Collaboration",
      message: "Second message body",
      botcheck: "",
    });

    expect(MockResend).toHaveBeenCalledTimes(1);
  });
});
