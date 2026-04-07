import type { ApiRequestShape } from "./types";
import { getServerEnv } from "./env";
import { isString } from "./strings";

const LOCALHOST_ORIGIN_PATTERN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const getAllowedOrigins = () => getServerEnv().allowedOrigins;

const isLocalhostOrigin = (origin: string) =>
  LOCALHOST_ORIGIN_PATTERN.test(origin);

export const getOriginHeader = (headers: ApiRequestShape["headers"]) => {
  const origin = headers.origin;

  if (Array.isArray(origin)) {
    return origin[0];
  }

  return origin;
};

export const isAllowedOrigin = (origin: string | undefined) =>
  isString(origin) &&
  (isLocalhostOrigin(origin) || getAllowedOrigins().includes(origin));
