import { afterEach, describe, expect, it, vi } from "vitest";

const { limit, MockRatelimit, MockRedis, slidingWindow } = vi.hoisted(() => {
  const limit =
    vi.fn<
      () => Promise<{ success: boolean; remaining?: number; reset?: number }>
    >();
  const slidingWindow = vi.fn(() => "window");
  const MockRatelimit = vi.fn().mockImplementation(() => ({ limit }));
  const MockRedis = vi.fn();

  return {
    limit,
    MockRatelimit,
    MockRedis,
    slidingWindow,
  };
});

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: Object.assign(MockRatelimit, {
    slidingWindow,
  }),
}));

vi.mock("@upstash/redis", () => ({
  Redis: MockRedis,
}));

import { resetServerEnv } from "../shared/env.js";
import { isRateLimited, resetRateLimitStore } from "./rateLimit.js";

describe("isRateLimited", () => {
  afterEach(() => {
    limit.mockReset();
    MockRatelimit.mockClear();
    MockRedis.mockClear();
    slidingWindow.mockClear();
    resetRateLimitStore();
    resetServerEnv();
    vi.unstubAllEnvs();
  });

  it("fails open when upstash env vars are absent", async () => {
    const result = await isRateLimited({
      origin: "https://portfolio.test",
    });

    expect(result).toMatchObject({
      limited: false,
      limit: 1,
      window: "1 d",
      fingerprintHash: expect.any(String),
    });
    expect(MockRatelimit).not.toHaveBeenCalled();
  });

  it("returns false when the request is within the limit", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.test");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");
    limit.mockResolvedValue({ success: true, remaining: 0, reset: 123 });

    const result = await isRateLimited({
      origin: "https://portfolio.test",
    });

    expect(result).toMatchObject({
      limited: false,
      remaining: 0,
      reset: 123,
    });
    expect(MockRedis).toHaveBeenCalledWith({
      url: "https://redis.test",
      token: "token",
    });
    expect(slidingWindow).toHaveBeenCalledWith(1, "1 d");
  });

  it("returns true when the request exceeds the limit", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.test");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");
    limit.mockResolvedValue({ success: false, remaining: 0, reset: 456 });

    const result = await isRateLimited({
      origin: "https://portfolio.test",
    });

    expect(result).toMatchObject({
      limited: true,
      remaining: 0,
      reset: 456,
    });
  });
});
