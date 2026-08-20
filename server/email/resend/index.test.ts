import { afterEach, describe, expect, it, vi } from "vitest";

const { sendEmail, MockResend } = vi.hoisted(() => {
  interface ResendSendResult {
    data: { id: string } | null;
    error: { message: string; name?: string; statusCode?: number } | null;
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

import { resetResendClient } from "./client.js";
import { resetEmailConfig } from "./config.js";
import { sendContactEmail } from "./index.js";
import { SEND_EMAIL_RESULT } from "../types.js";
import { resetServerEnv } from "../../shared/env.js";
import { EMAIL_RESEND_REJECTED } from "../../shared/events.js";

describe("sendContactEmail", () => {
  afterEach(() => {
    sendEmail.mockReset();
    MockResend.mockClear();
    resetEmailConfig();
    resetResendClient();
    resetServerEnv();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("returns missing_config when env vars are absent", async () => {
    const result = await sendContactEmail(
      {
        name: "Anan",
        email: "anan@example.com",
        subject: "Hiring Inquiry",
        message: "This is a valid contact message.",
        botcheck: "",
      },
      { requestId: "req_1" },
    );

    expect(result).toBe(SEND_EMAIL_RESULT.MISSING_CONFIG);
  });

  it("returns failed when resend rejects the email", async () => {
    const consoleInfo = vi.spyOn(console, "info").mockImplementation(() => {
      return undefined;
    });

    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("RESEND_FROM_EMAIL", "Portfolio <contact@send.anansaleh.com>");
    vi.stubEnv("CONTACT_TO_EMAIL", "anansaleh18@gmail.com");
    sendEmail.mockResolvedValue({
      data: null,
      error: {
        message: "blocked",
        name: "validation_error",
        statusCode: 422,
      },
    });

    const result = await sendContactEmail(
      {
        name: "Anan",
        email: "anan@example.com",
        subject: "Hiring Inquiry",
        message: "This is a valid contact message.",
        botcheck: "",
      },
      { requestId: "req_1" },
    );

    expect(result).toBe(SEND_EMAIL_RESULT.FAILED);
    expect(consoleInfo).toHaveBeenCalledWith(
      expect.objectContaining({
        event: EMAIL_RESEND_REJECTED,
        message: "blocked",
        providerErrorName: "validation_error",
        providerStatusCode: 422,
      }),
    );
    consoleInfo.mockRestore();
  });

  it("returns sent when resend accepts the email", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("RESEND_FROM_EMAIL", "Portfolio <contact@send.anansaleh.com>");
    vi.stubEnv("CONTACT_TO_EMAIL", "anansaleh18@gmail.com");
    sendEmail.mockResolvedValue({
      data: { id: "email_123" },
      error: null,
    });

    const result = await sendContactEmail(
      {
        name: "Anan",
        email: "anan@example.com",
        subject: "Hiring Inquiry",
        message: "This is a valid contact message.",
        botcheck: "",
      },
      { requestId: "req_1" },
    );

    expect(result).toBe(SEND_EMAIL_RESULT.SENT);
    expect(MockResend).toHaveBeenCalledTimes(1);
    const firstCall = sendEmail.mock.calls[0];
    const firstArg = firstCall?.[0];

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

  it("uses the configured resend template id when provided", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("RESEND_FROM_EMAIL", "Portfolio <contact@send.anansaleh.com>");
    vi.stubEnv("RESEND_CONTACT_TEMPLATE_ID", "portfolio-contact");
    vi.stubEnv("CONTACT_TO_EMAIL", "anansaleh18@gmail.com");
    sendEmail.mockResolvedValue({
      data: { id: "email_123" },
      error: null,
    });

    await sendContactEmail(
      {
        name: "Anan",
        email: "anan@example.com",
        subject: "Hiring Inquiry",
        message: "This is a valid contact message.",
        botcheck: "",
      },
      { requestId: "req_1" },
    );

    expect(sendEmail.mock.calls[0]?.[0].template.id).toBe("portfolio-contact");
  });

  it("reuses the configured resend client", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("RESEND_FROM_EMAIL", "Portfolio <contact@send.anansaleh.com>");
    vi.stubEnv("CONTACT_TO_EMAIL", "anansaleh18@gmail.com");
    sendEmail.mockResolvedValue({
      data: { id: "email_123" },
      error: null,
    });

    await sendContactEmail(
      {
        name: "Anan",
        email: "anan@example.com",
        subject: "Hiring Inquiry",
        message: "First message body",
        botcheck: "",
      },
      { requestId: "req_1" },
    );

    await sendContactEmail(
      {
        name: "Anan",
        email: "anan@example.com",
        subject: "Collaboration",
        message: "Second message body",
        botcheck: "",
      },
      { requestId: "req_2" },
    );

    expect(MockResend).toHaveBeenCalledTimes(1);
  });
});
