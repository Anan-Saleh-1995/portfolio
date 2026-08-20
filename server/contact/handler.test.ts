import { afterEach, describe, expect, it, vi } from "vitest";
import { CONTACT_API_ERROR_CODE } from "../../shared/contact.js";

vi.mock("../email/resend/index.js", () => ({
  sendContactEmail: vi.fn(),
}));

vi.mock("./rateLimit.js", () => ({
  isRateLimited: vi.fn().mockResolvedValue({
    limited: false,
    fingerprintHash: "hash",
    limit: 5,
    policy: "burst",
    window: "1 h",
  }),
  resetRateLimitStore: vi.fn(),
}));

import { apiApp } from "../app.js";
import { sendContactEmail } from "../email/resend/index.js";
import { SEND_EMAIL_RESULT } from "../email/types.js";
import { resetServerEnv } from "../shared/env.js";
import { HTTP_METHOD, HTTP_STATUS } from "../shared/http.js";
import { isRateLimited, resetRateLimitStore } from "./rateLimit.js";
import {
  CONTACT_SUCCESS_RESPONSE,
  createContactFailureResponse,
} from "./responses.js";
import type { ContactPayload } from "./types.js";

const mockedSendContactEmail = vi.mocked(sendContactEmail);
const mockedIsRateLimited = vi.mocked(isRateLimited);
const TEST_SITE_URL = "https://portfolio.test";
const TEST_ALLOWED_ORIGINS = TEST_SITE_URL;

const validBody = {
  name: "Anan",
  email: "anan@example.com",
  subject: "Hiring Inquiry",
  message: "This is a valid contact message.",
  botcheck: "",
} satisfies ContactPayload;

const defaultHeaders = {
  origin: TEST_SITE_URL,
  "content-type": "application/json",
};

const createBody = (body: unknown) =>
  body === undefined ? undefined : JSON.stringify(body);

const requestContact = (
  request: RequestInit & {
    json?: unknown;
  } = {},
) =>
  apiApp.request("/api/contact", {
    method: HTTP_METHOD.POST,
    ...request,
    headers: {
      ...defaultHeaders,
      ...(request.headers ?? {}),
    },
    body: request.body ?? createBody(request.json),
  });

const requestContactWithoutDefaults = (request: RequestInit = {}) =>
  apiApp.request("/api/contact", request);

describe("contact handler", () => {
  afterEach(() => {
    mockedSendContactEmail.mockReset();
    mockedIsRateLimited.mockReset();
    mockedIsRateLimited.mockResolvedValue({
      limited: false,
      fingerprintHash: "hash",
      limit: 5,
      policy: "burst",
      window: "1 h",
    });
    resetRateLimitStore();
    resetServerEnv();
    vi.unstubAllEnvs();
  });

  it("rejects non-post methods", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", TEST_ALLOWED_ORIGINS);

    const response = await requestContactWithoutDefaults({
      method: HTTP_METHOD.GET,
    });

    expect(response.status).toBe(HTTP_STATUS.METHOD_NOT_ALLOWED);
    expect(response.headers.get("Allow")).toBe(HTTP_METHOD.POST);
    expect(await response.json()).toEqual(
      createContactFailureResponse(CONTACT_API_ERROR_CODE.INVALID_REQUEST),
    );
  });

  it("rejects invalid payloads", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", TEST_ALLOWED_ORIGINS);

    const response = await requestContact({
      json: { name: "Anan" },
    });

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(response.headers.get("X-Request-ID")).toEqual(expect.any(String));
    expect(mockedIsRateLimited).not.toHaveBeenCalled();
    expect(await response.json()).toEqual(
      createContactFailureResponse(CONTACT_API_ERROR_CODE.INVALID_REQUEST),
    );
  });

  it("rejects unsupported content types before reading the payload", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", TEST_ALLOWED_ORIGINS);

    const response = await requestContact({
      headers: { origin: TEST_SITE_URL, "content-type": "text/plain" },
      body: "not json",
    });

    expect(response.status).toBe(HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE);
    expect(mockedIsRateLimited).not.toHaveBeenCalled();
    expect(mockedSendContactEmail).not.toHaveBeenCalled();
  });

  it("rejects invalid email addresses on the server", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", TEST_ALLOWED_ORIGINS);

    const response = await requestContact({
      json: { ...validBody, email: "not-an-email" },
    });

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(mockedIsRateLimited).not.toHaveBeenCalled();
    expect(mockedSendContactEmail).not.toHaveBeenCalled();
  });

  it("rejects unsupported subjects on the server", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", TEST_ALLOWED_ORIGINS);

    const response = await requestContact({
      json: { ...validBody, subject: "Injected subject" },
    });

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(mockedIsRateLimited).not.toHaveBeenCalled();
    expect(mockedSendContactEmail).not.toHaveBeenCalled();
  });

  it("returns success for honeypot submissions without sending email", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", TEST_ALLOWED_ORIGINS);

    const response = await requestContact({
      json: { ...validBody, botcheck: "spam" },
    });

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.headers.get("X-Request-ID")).toEqual(expect.any(String));
    expect(await response.json()).toEqual(CONTACT_SUCCESS_RESPONSE);
    expect(mockedIsRateLimited).not.toHaveBeenCalled();
    expect(mockedSendContactEmail).not.toHaveBeenCalled();
  });

  it("returns failure when env vars are missing", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", TEST_ALLOWED_ORIGINS);
    mockedSendContactEmail.mockResolvedValue(SEND_EMAIL_RESULT.MISSING_CONFIG);

    const response = await requestContact({
      json: validBody,
    });

    expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(await response.json()).toEqual(
      createContactFailureResponse(CONTACT_API_ERROR_CODE.DELIVERY_UNAVAILABLE),
    );
  });

  it("returns failure when origin is not allowed", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", TEST_ALLOWED_ORIGINS);

    const response = await requestContact({
      headers: { origin: "https://evil.example" },
      json: validBody,
    });

    expect(response.status).toBe(HTTP_STATUS.FORBIDDEN);
    expect(await response.json()).toEqual(
      createContactFailureResponse(CONTACT_API_ERROR_CODE.FORBIDDEN_ORIGIN),
    );
  });

  it("returns failure when too many requests arrive from the same origin", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", TEST_ALLOWED_ORIGINS);
    mockedIsRateLimited.mockResolvedValue({
      limited: true,
      fingerprintHash: "hash",
      limit: 5,
      policy: "burst",
      window: "1 h",
      remaining: 0,
      reset: Date.now() + 1000,
    });

    const response = await requestContact({
      json: validBody,
    });

    expect(response.status).toBe(HTTP_STATUS.TOO_MANY_REQUESTS);
    expect(Number(response.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect(mockedSendContactEmail).not.toHaveBeenCalled();
    expect(await response.json()).toEqual(
      createContactFailureResponse(CONTACT_API_ERROR_CODE.RATE_LIMITED),
    );
  });

  it("continues delivery when the rate limit backend is unavailable", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", TEST_ALLOWED_ORIGINS);
    mockedIsRateLimited.mockRejectedValue(new Error("redis unavailable"));
    mockedSendContactEmail.mockResolvedValue(SEND_EMAIL_RESULT.SENT);

    const response = await requestContact({
      json: validBody,
    });

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(mockedSendContactEmail).toHaveBeenCalledOnce();
  });

  it("returns failure when resend rejects the email", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", TEST_ALLOWED_ORIGINS);
    mockedSendContactEmail.mockResolvedValue(SEND_EMAIL_RESULT.FAILED);

    const response = await requestContact({
      json: validBody,
    });

    expect(response.status).toBe(HTTP_STATUS.BAD_GATEWAY);
    expect(await response.json()).toEqual(
      createContactFailureResponse(CONTACT_API_ERROR_CODE.DELIVERY_UNAVAILABLE),
    );
  });

  it("returns success when resend accepts the email", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", TEST_ALLOWED_ORIGINS);
    mockedSendContactEmail.mockResolvedValue(SEND_EMAIL_RESULT.SENT);

    const response = await requestContact({
      json: validBody,
    });

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(await response.json()).toEqual(CONTACT_SUCCESS_RESPONSE);
    expect(mockedSendContactEmail).toHaveBeenCalledWith(
      validBody,
      expect.objectContaining({
        requestId: expect.any(String),
      }),
    );
  });
});
