import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getServerEnv } from "../shared/env.js";
import type { ApiRequestShape } from "../shared/types.js";

const WINDOW_LIMIT = 1;
const WINDOW_DURATION = "1 d";

let cachedRateLimit: Ratelimit | null | undefined;

const getHeaderValue = (
  value: string | string[] | undefined,
): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const getRequestFingerprint = (headers: ApiRequestShape["headers"]) =>
  getHeaderValue(headers["x-forwarded-for"]) ??
  getHeaderValue(headers["x-real-ip"]) ??
  getHeaderValue(headers.origin) ??
  "unknown";

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

  if (!rateLimit) {
    return false;
  }

  const fingerprint = getRequestFingerprint(headers);
  const result = await rateLimit.limit(fingerprint);

  return !result.success;
};

export const resetRateLimitStore = () => {
  cachedRateLimit = undefined;
};
