import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getServerEnv } from "../shared/env.js";
import { getRequestFingerprintHash } from "../shared/request.js";
import type { ApiRequestShape } from "../shared/types.js";

const WINDOW_LIMIT = 5;
const WINDOW_DURATION = "1 d";

let cachedRateLimit: Ratelimit | null | undefined;

interface RateLimitCheckResult {
  limited: boolean;
  fingerprintHash: string;
  limit: number;
  window: string;
  remaining?: number;
  reset?: number;
}

const createRateLimit = () => {
  const env = getServerEnv();
  const url = env.upstashRedisRestUrl;
  const token = env.upstashRedisRestToken;

  if (url === "" || token === "") {
    return null;
  }

  return new Ratelimit({
    redis: new Redis({
      url,
      token,
    }),
    limiter: Ratelimit.slidingWindow(WINDOW_LIMIT, WINDOW_DURATION),
    analytics: false,
    prefix: "contact",
  });
};

const getRateLimit = () => {
  if (cachedRateLimit !== undefined) {
    return cachedRateLimit;
  }

  cachedRateLimit = createRateLimit();
  return cachedRateLimit;
};

export const isRateLimited = async (headers: ApiRequestShape["headers"]) => {
  const rateLimit = getRateLimit();
  const fingerprintHash = getRequestFingerprintHash(headers);

  if (!rateLimit) {
    return {
      limited: false,
      fingerprintHash,
      limit: WINDOW_LIMIT,
      window: WINDOW_DURATION,
    } satisfies RateLimitCheckResult;
  }

  const result = await rateLimit.limit(fingerprintHash);

  return {
    limited: !result.success,
    fingerprintHash,
    limit: WINDOW_LIMIT,
    window: WINDOW_DURATION,
    remaining: result.remaining,
    reset: result.reset,
  } satisfies RateLimitCheckResult;
};

export const resetRateLimitStore = () => {
  cachedRateLimit = undefined;
};
