import { afterEach, describe, expect, it, vi } from "vitest";
import { CONTACT_API_ERROR_CODE } from "../../src/shared/contracts/contact.js";

vi.mock("../email/resend", () => ({
  sendContactEmail: vi.fn(),
}));

vi.mock("./rateLimit", () => ({
  isRateLimited: vi.fn().mockResolvedValue({
    limited: false,
    fingerprintHash: "hash",
    limit: 1,
    window: "1 d",
  }),
  resetRateLimitStore: vi.fn(),
}));

import { sendContactEmail } from "../email/resend/index.js";
import { SEND_EMAIL_RESULT } from "../email/types.js";
import { HTTP_METHOD, HTTP_STATUS } from "../shared/http.js";
import type { ApiRequestShape, ApiResponseShape } from "../shared/types.js";
import { handler } from "./handler.js";
import type { ContactPayload } from "./types.js";
import { isRateLimited, resetRateLimitStore } from "./rateLimit.js";
import {
  CONTACT_SUCCESS_RESPONSE,
  createContactFailureResponse,
} from "./responses.js";

const mockedSendContactEmail = vi.mocked(sendContactEmail);
const mockedIsRateLimited = vi.mocked(isRateLimited);
const TEST_SITE_URL = "https://portfolio.test";
const TEST_ALLOWED_ORIGINS = TEST_SITE_URL;

const createResponse = (): ApiResponseShape & {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
} => {
  const response: ApiResponseShape & {
    statusCode: number;
    headers: Record<string, string>;
    body: string;
  } = {
    statusCode: 200,
    headers: {},
    body: "",
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    setHeader(name: string, value: string) {
      this.headers[name] = value;
      return this;
    },
    send(body: string) {
      this.body = body;
    },
  };

  return response;
};

const validBody = {
  name: "Anan",
  email: "anan@example.com",
  subject: "Hiring Inquiry",
  message: "This is a valid contact message.",
  botcheck: "",
} satisfies ContactPayload;

const createRequest = (request: Partial<ApiRequestShape>): ApiRequestShape => ({
  method: HTTP_METHOD.POST,
  headers: {},
  body: undefined,
  ...request,
});

describe("contact handler", () => {
  afterEach(() => {
    mockedSendContactEmail.mockReset();
    mockedIsRateLimited.mockReset();
    mockedIsRateLimited.mockResolvedValue({
      limited: false,
      fingerprintHash: "hash",
      limit: 1,
      window: "1 d",
    });
    resetRateLimitStore();
    vi.unstubAllEnvs();
  });

  it("rejects non-post methods", async () => {
    const response = createResponse();

    vi.stubEnv("ALLOWED_ORIGINS", TEST_ALLOWED_ORIGINS);

    await handler(
      createRequest({ method: HTTP_METHOD.GET, body: undefined }),
      response,
    );

    expect(response.statusCode).toBe(HTTP_STATUS.METHOD_NOT_ALLOWED);
    expect(response.headers.Allow).toBe(HTTP_METHOD.POST);
    expect(response.body).toBe(
      JSON.stringify(
        createContactFailureResponse(CONTACT_API_ERROR_CODE.INVALID_REQUEST),
      ),
    );
  });

  it("rejects invalid payloads", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", TEST_ALLOWED_ORIGINS);
    const response = createResponse();

    await handler(
      createRequest({
        headers: { origin: TEST_SITE_URL },
        body: { name: "Anan" },
      }),
      response,
    );

    expect(response.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(response.body).toBe(
      JSON.stringify(
        createContactFailureResponse(CONTACT_API_ERROR_CODE.INVALID_REQUEST),
      ),
    );
  });

  it("returns success for honeypot submissions without sending email", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", TEST_ALLOWED_ORIGINS);
    const response = createResponse();

    await handler(
      createRequest({
        headers: { origin: TEST_SITE_URL },
        body: { ...validBody, botcheck: "spam" },
      }),
      response,
    );

    expect(response.statusCode).toBe(HTTP_STATUS.OK);
    expect(response.body).toBe(JSON.stringify(CONTACT_SUCCESS_RESPONSE));
    expect(mockedSendContactEmail).not.toHaveBeenCalled();
  });

  it("returns failure when env vars are missing", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", TEST_ALLOWED_ORIGINS);
    mockedSendContactEmail.mockResolvedValue(SEND_EMAIL_RESULT.MISSING_CONFIG);
    const response = createResponse();

    await handler(
      createRequest({
        headers: { origin: TEST_SITE_URL },
        body: validBody,
      }),
      response,
    );

    expect(response.statusCode).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(response.body).toBe(
      JSON.stringify(
        createContactFailureResponse(
          CONTACT_API_ERROR_CODE.DELIVERY_UNAVAILABLE,
        ),
      ),
    );
  });

  it("returns failure when origin is not allowed", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", TEST_ALLOWED_ORIGINS);
    const response = createResponse();

    await handler(
      createRequest({
        headers: { origin: "https://evil.example" },
        body: validBody,
      }),
      response,
    );

    expect(response.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
    expect(response.body).toBe(
      JSON.stringify(
        createContactFailureResponse(CONTACT_API_ERROR_CODE.FORBIDDEN_ORIGIN),
      ),
    );
  });

  it("returns failure when too many requests arrive from the same origin", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", TEST_ALLOWED_ORIGINS);
    mockedIsRateLimited.mockResolvedValue({
      limited: true,
      fingerprintHash: "hash",
      limit: 1,
      window: "1 d",
      remaining: 0,
      reset: Date.now() + 1000,
    });

    const blockedResponse = createResponse();

    await handler(
      createRequest({
        headers: { origin: TEST_SITE_URL },
        body: validBody,
      }),
      blockedResponse,
    );

    expect(blockedResponse.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
    expect(blockedResponse.body).toBe(
      JSON.stringify(
        createContactFailureResponse(CONTACT_API_ERROR_CODE.RATE_LIMITED),
      ),
    );
  });

  it("returns failure when resend rejects the email", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", TEST_ALLOWED_ORIGINS);
    mockedSendContactEmail.mockResolvedValue(SEND_EMAIL_RESULT.FAILED);
    const response = createResponse();

    await handler(
      createRequest({
        headers: { origin: TEST_SITE_URL },
        body: validBody,
      }),
      response,
    );

    expect(response.statusCode).toBe(HTTP_STATUS.BAD_GATEWAY);
    expect(response.body).toBe(
      JSON.stringify(
        createContactFailureResponse(
          CONTACT_API_ERROR_CODE.DELIVERY_UNAVAILABLE,
        ),
      ),
    );
  });

  it("returns success when resend accepts the email", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", TEST_ALLOWED_ORIGINS);
    mockedSendContactEmail.mockResolvedValue(SEND_EMAIL_RESULT.SENT);
    const response = createResponse();

    await handler(
      createRequest({
        headers: { origin: TEST_SITE_URL },
        body: validBody,
      }),
      response,
    );

    expect(response.statusCode).toBe(HTTP_STATUS.OK);
    expect(response.body).toBe(JSON.stringify(CONTACT_SUCCESS_RESPONSE));
    expect(mockedSendContactEmail).toHaveBeenCalledWith(
      validBody,
      expect.objectContaining({
        requestId: expect.any(String),
      }),
    );
  });
});
