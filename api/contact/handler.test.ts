import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../email/resend", () => ({
  sendContactEmail: vi.fn(),
}));

import { sendContactEmail } from "../email/resend";
import { SendEmailResult } from "../email/types";
import { HttpMethod, HttpStatus } from "../shared/http";
import type { ApiRequestShape, ApiResponseShape } from "../shared/types";
import { handler } from "./handler";
import type { ContactPayload } from "./types";
import {
  CONTACT_FAILURE_RESPONSE,
  CONTACT_SUCCESS_RESPONSE,
} from "./responses";

const mockedSendContactEmail = vi.mocked(sendContactEmail);
const TEST_SITE_URL = "https://portfolio.test";

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
  method: HttpMethod.Post,
  headers: {},
  body: undefined,
  ...request,
});

describe("contact handler", () => {
  afterEach(() => {
    mockedSendContactEmail.mockReset();
    vi.unstubAllEnvs();
  });

  it("rejects non-post methods", async () => {
    const response = createResponse();

    vi.stubEnv("SITE_URL", TEST_SITE_URL);

    await handler(
      createRequest({ method: HttpMethod.Get, body: undefined }),
      response,
    );

    expect(response.statusCode).toBe(HttpStatus.MethodNotAllowed);
    expect(response.headers.Allow).toBe(HttpMethod.Post);
    expect(response.body).toBe(JSON.stringify(CONTACT_FAILURE_RESPONSE));
  });

  it("rejects invalid payloads", async () => {
    vi.stubEnv("SITE_URL", TEST_SITE_URL);
    const response = createResponse();

    await handler(
      createRequest({
        headers: { origin: TEST_SITE_URL },
        body: { name: "Anan" },
      }),
      response,
    );

    expect(response.statusCode).toBe(HttpStatus.BadRequest);
    expect(response.body).toBe(JSON.stringify(CONTACT_FAILURE_RESPONSE));
  });

  it("returns success for honeypot submissions without sending email", async () => {
    vi.stubEnv("SITE_URL", TEST_SITE_URL);
    const response = createResponse();

    await handler(
      createRequest({
        headers: { origin: TEST_SITE_URL },
        body: { ...validBody, botcheck: "spam" },
      }),
      response,
    );

    expect(response.statusCode).toBe(HttpStatus.Ok);
    expect(response.body).toBe(JSON.stringify(CONTACT_SUCCESS_RESPONSE));
    expect(mockedSendContactEmail).not.toHaveBeenCalled();
  });

  it("returns failure when env vars are missing", async () => {
    vi.stubEnv("SITE_URL", TEST_SITE_URL);
    mockedSendContactEmail.mockResolvedValue(SendEmailResult.MissingConfig);
    const response = createResponse();

    await handler(
      createRequest({
        headers: { origin: TEST_SITE_URL },
        body: validBody,
      }),
      response,
    );

    expect(response.statusCode).toBe(HttpStatus.InternalServerError);
    expect(response.body).toBe(JSON.stringify(CONTACT_FAILURE_RESPONSE));
  });

  it("returns failure when origin is not allowed", async () => {
    vi.stubEnv("SITE_URL", TEST_SITE_URL);
    const response = createResponse();

    await handler(
      createRequest({
        headers: { origin: "https://evil.example" },
        body: validBody,
      }),
      response,
    );

    expect(response.statusCode).toBe(HttpStatus.Forbidden);
    expect(response.body).toBe(JSON.stringify(CONTACT_FAILURE_RESPONSE));
  });

  it("returns failure when resend rejects the email", async () => {
    vi.stubEnv("SITE_URL", TEST_SITE_URL);
    mockedSendContactEmail.mockResolvedValue(SendEmailResult.Failed);
    const response = createResponse();

    await handler(
      createRequest({
        headers: { origin: TEST_SITE_URL },
        body: validBody,
      }),
      response,
    );

    expect(response.statusCode).toBe(HttpStatus.BadGateway);
    expect(response.body).toBe(JSON.stringify(CONTACT_FAILURE_RESPONSE));
  });

  it("returns success when resend accepts the email", async () => {
    vi.stubEnv("SITE_URL", TEST_SITE_URL);
    mockedSendContactEmail.mockResolvedValue(SendEmailResult.Sent);
    const response = createResponse();

    await handler(
      createRequest({
        headers: { origin: TEST_SITE_URL },
        body: validBody,
      }),
      response,
    );

    expect(response.statusCode).toBe(HttpStatus.Ok);
    expect(response.body).toBe(JSON.stringify(CONTACT_SUCCESS_RESPONSE));
    expect(mockedSendContactEmail).toHaveBeenCalledWith(validBody);
  });
});
