import { afterEach, describe, expect, it, vi } from "vitest";

const { limit, MockRatelimit, MockRedis, slidingWindow } = vi.hoisted(() => {
  const limit =
    vi.fn<
      () => Promise<{ success: boolean; remaining?: number; reset?: number }>
    >();
  const slidingWindow = vi.fn(() => "window");
  const MockRatelimit = vi.fn().mockImplementation(function MockRatelimit() {
    return { limit };
  });
  const MockRedis = vi.fn().mockImplementation(function MockRedis() {
    return {};
  });

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
      limit: 5,
      policy: "disabled",
      window: "1 h",
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
      policy: "daily",
      limit: 20,
      window: "1 d",
      remaining: 0,
      reset: 123,
    });
    expect(MockRedis).toHaveBeenCalledWith({
      url: "https://redis.test",
      token: "token",
    });
    expect(slidingWindow).toHaveBeenCalledWith(5, "1 h");
    expect(slidingWindow).toHaveBeenCalledWith(20, "1 d");
    expect(MockRatelimit).toHaveBeenCalledTimes(2);
  });

  it("returns true when the request exceeds the burst limit", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.test");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");
    limit.mockResolvedValue({ success: false, remaining: 0, reset: 456 });

    const result = await isRateLimited({
      origin: "https://portfolio.test",
    });

    expect(result).toMatchObject({
      limited: true,
      policy: "burst",
      limit: 5,
      window: "1 h",
      remaining: 0,
      reset: 456,
    });
    expect(limit).toHaveBeenCalledOnce();
  });

  it("returns true when the request exceeds the daily limit", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.test");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");
    limit
      .mockResolvedValueOnce({ success: true, remaining: 4, reset: 123 })
      .mockResolvedValueOnce({ success: false, remaining: 0, reset: 456 });

    const result = await isRateLimited({
      origin: "https://portfolio.test",
    });

    expect(result).toMatchObject({
      limited: true,
      policy: "daily",
      limit: 20,
      window: "1 d",
      remaining: 0,
      reset: 456,
    });
    expect(limit).toHaveBeenCalledTimes(2);
  });
});
