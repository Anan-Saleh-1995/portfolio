import { afterEach, describe, expect, it, vi } from "vitest";
import { resetServerEnv } from "../shared/env.js";
import { HTTP_METHOD, HTTP_STATUS } from "../shared/http.js";
import type { ApiRequestShape, ApiResponseShape } from "../shared/types.js";
import { handler } from "./handler.js";

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

const createRequest = (request: Partial<ApiRequestShape>): ApiRequestShape => ({
  method: HTTP_METHOD.GET,
  headers: {},
  ...request,
});

describe("health handler", () => {
  afterEach(() => {
    resetServerEnv();
    vi.unstubAllEnvs();
  });

  it("returns cheap liveness by default", async () => {
    const response = createResponse();

    await handler(createRequest({}), response);

    expect(response.statusCode).toBe(HTTP_STATUS.OK);
    expect(response.headers["X-Request-ID"]).toEqual(expect.any(String));
    expect(response.body).toBe(JSON.stringify({ ok: true }));
  });

  it("supports head liveness checks", async () => {
    const response = createResponse();

    await handler(createRequest({ method: HTTP_METHOD.HEAD }), response);

    expect(response.statusCode).toBe(HTTP_STATUS.OK);
    expect(response.headers["Content-Length"]).toBe("0");
    expect(response.headers["X-Request-ID"]).toEqual(expect.any(String));
    expect(response.body).toBe("");
  });

  it("rejects unsupported methods", async () => {
    const response = createResponse();

    await handler(createRequest({ method: HTTP_METHOD.POST }), response);

    expect(response.statusCode).toBe(HTTP_STATUS.METHOD_NOT_ALLOWED);
    expect(response.headers.Allow).toBe("GET, HEAD");
    expect(response.headers["X-Request-ID"]).toEqual(expect.any(String));
  });

  it("returns ready when contact config is complete and rate limit is disabled", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", "https://portfolio.test");
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("RESEND_FROM_EMAIL", "Portfolio <contact@send.example.com>");
    vi.stubEnv("CONTACT_TO_EMAIL", "anan@example.com");
    const response = createResponse();

    await handler(createRequest({ query: { ready: "1" } }), response);

    expect(response.statusCode).toBe(HTTP_STATUS.OK);
    expect(JSON.parse(response.body)).toEqual({
      ok: true,
      checks: {
        contact: {
          ready: true,
          allowedOriginsConfigured: true,
          emailConfigured: true,
          resendTemplateConfigured: true,
          rateLimitConfigured: false,
          rateLimitOptional: true,
          rateLimitReady: true,
        },
      },
    });
  });

  it("returns unavailable when contact email config is incomplete", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", "https://portfolio.test");
    const response = createResponse();

    await handler(createRequest({ query: { readiness: "true" } }), response);

    expect(response.statusCode).toBe(HTTP_STATUS.SERVICE_UNAVAILABLE);
    expect(JSON.parse(response.body).checks.contact).toMatchObject({
      ready: false,
      allowedOriginsConfigured: true,
      emailConfigured: false,
      rateLimitReady: true,
    });
  });

  it("returns unavailable when optional rate limit config is partial", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", "https://portfolio.test");
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("RESEND_FROM_EMAIL", "Portfolio <contact@send.example.com>");
    vi.stubEnv("CONTACT_TO_EMAIL", "anan@example.com");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.test");
    const response = createResponse();

    await handler(createRequest({ url: "/api/health?ready=1" }), response);

    expect(response.statusCode).toBe(HTTP_STATUS.SERVICE_UNAVAILABLE);
    expect(JSON.parse(response.body).checks.contact).toMatchObject({
      ready: false,
      emailConfigured: true,
      rateLimitConfigured: false,
      rateLimitReady: false,
    });
  });
});
