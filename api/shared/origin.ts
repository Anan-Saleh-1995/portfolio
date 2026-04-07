import type { ApiRequestShape } from "./types";

const LOCALHOST_ORIGIN_PATTERN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const getEnvString = (value: string | undefined) =>
  typeof value === "string" ? value.trim() : "";

const createWwwVariant = (origin: string) => {
  try {
    const url = new URL(origin);

    if (
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname.startsWith("www.")
    ) {
      return "";
    }

    url.hostname = `www.${url.hostname}`;
    return url.origin;
  } catch {
    return "";
  }
};

const getAllowedOrigins = () => {
  const siteOrigin = getEnvString(process.env.SITE_URL);

  if (siteOrigin === "") {
    return new Set<string>();
  }

  return new Set([siteOrigin, createWwwVariant(siteOrigin)].filter(Boolean));
};

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
  typeof origin === "string" &&
  (isLocalhostOrigin(origin) || getAllowedOrigins().has(origin));
