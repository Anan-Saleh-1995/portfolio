import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getServerEnv } from "../shared/env.js";
import { getRequestFingerprintHash } from "../shared/request.js";
import type { ApiRequestShape } from "../shared/types.js";

const RATE_LIMIT_POLICIES = [
  { name: "burst", limit: 5, window: "1 h" },
  { name: "daily", limit: 20, window: "1 d" },
] as const;

let cachedRateLimits:
  | {
      policy: (typeof RATE_LIMIT_POLICIES)[number];
      limiter: Ratelimit;
    }[]
  | null
  | undefined;

interface RateLimitCheckResult {
  limited: boolean;
  fingerprintHash: string;
  limit: number;
  policy: string;
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

  const redis = new Redis({
    url,
    token,
  });

  return RATE_LIMIT_POLICIES.map((policy) => ({
    policy,
    limiter: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(policy.limit, policy.window),
      analytics: false,
      prefix: `contact:${policy.name}`,
    }),
  }));
};

const getRateLimit = () => {
  if (cachedRateLimits !== undefined) {
    return cachedRateLimits;
  }

  cachedRateLimits = createRateLimit();
  return cachedRateLimits;
};

export const isRateLimited = async (headers: ApiRequestShape["headers"]) => {
  const rateLimits = getRateLimit();
  const fingerprintHash = getRequestFingerprintHash(headers);

  if (!rateLimits) {
    return {
      limited: false,
      fingerprintHash,
      limit: RATE_LIMIT_POLICIES[0].limit,
      policy: "disabled",
      window: RATE_LIMIT_POLICIES[0].window,
    } satisfies RateLimitCheckResult;
  }

  let allowedResult: RateLimitCheckResult | null = null;

  for (const { limiter, policy } of rateLimits) {
    const result = await limiter.limit(fingerprintHash);

    const checkResult = {
      limited: !result.success,
      fingerprintHash,
      limit: policy.limit,
      policy: policy.name,
      window: policy.window,
      remaining: result.remaining,
      reset: result.reset,
    } satisfies RateLimitCheckResult;

    if (checkResult.limited) {
      return checkResult;
    }

    allowedResult = checkResult;
  }

  return (
    allowedResult ??
    ({
      limited: false,
      fingerprintHash,
      limit: RATE_LIMIT_POLICIES[0].limit,
      policy: "unknown",
      window: RATE_LIMIT_POLICIES[0].window,
    } satisfies RateLimitCheckResult)
  );
};

export const resetRateLimitStore = () => {
  cachedRateLimits = undefined;
};
