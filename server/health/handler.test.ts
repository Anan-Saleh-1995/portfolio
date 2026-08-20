import { afterEach, describe, expect, it, vi } from "vitest";
import { apiApp } from "../app.js";
import { resetServerEnv } from "../shared/env.js";
import { HTTP_METHOD, HTTP_STATUS } from "../shared/http.js";

describe("health handler", () => {
  afterEach(() => {
    resetServerEnv();
    vi.unstubAllEnvs();
  });

  it("returns cheap liveness by default", async () => {
    const response = await apiApp.request("/api/health");

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.headers.get("X-Request-ID")).toEqual(expect.any(String));
    expect(await response.json()).toEqual({ ok: true });
  });

  it("supports head liveness checks", async () => {
    const response = await apiApp.request("/api/health", {
      method: HTTP_METHOD.HEAD,
    });

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.headers.get("X-Request-ID")).toEqual(expect.any(String));
    expect(await response.text()).toBe("");
  });

  it("rejects unsupported methods", async () => {
    const response = await apiApp.request("/api/health", {
      method: HTTP_METHOD.POST,
    });

    expect(response.status).toBe(HTTP_STATUS.METHOD_NOT_ALLOWED);
    expect(response.headers.get("Allow")).toBe("GET, HEAD");
    expect(response.headers.get("X-Request-ID")).toEqual(expect.any(String));
  });

  it("returns ready when contact config is complete and rate limit is disabled", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", "https://portfolio.test");
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("RESEND_FROM_EMAIL", "Portfolio <contact@send.example.com>");
    vi.stubEnv("CONTACT_TO_EMAIL", "anan@example.com");

    const response = await apiApp.request("/api/health?ready=1");

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(await response.json()).toEqual({
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

    const response = await apiApp.request("/api/health?readiness=true");

    expect(response.status).toBe(HTTP_STATUS.SERVICE_UNAVAILABLE);
    expect((await response.json()).checks.contact).toMatchObject({
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

    const response = await apiApp.request("/api/health?ready=1");

    expect(response.status).toBe(HTTP_STATUS.SERVICE_UNAVAILABLE);
    expect((await response.json()).checks.contact).toMatchObject({
      ready: false,
      emailConfigured: true,
      rateLimitConfigured: false,
      rateLimitReady: false,
    });
  });
});
