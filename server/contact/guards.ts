import {
  CONTACT_API_ERROR_CODE,
  type ContactApiErrorCode,
} from "../../src/shared/contracts/contact.js";
import {
  CONTACT_METHOD_NOT_ALLOWED,
  CONTACT_ORIGIN_REJECTED,
  CONTACT_RATE_LIMIT_SKIPPED,
  CONTACT_RATE_LIMITED,
  CONTACT_UNSUPPORTED_MEDIA_TYPE,
} from "../shared/events.js";
import { getHeaderValue } from "../shared/headers.js";
import { HTTP_METHOD, HTTP_STATUS, type HttpStatus } from "../shared/http.js";
import { logError, logInfo } from "../shared/logger.js";
import { getOriginHeader, isAllowedOrigin } from "../shared/origin.js";
import type { RequestContext } from "../shared/request.js";
import type { ApiRequestShape, ApiResponseShape } from "../shared/types.js";
import { isRateLimited } from "./rateLimit.js";
import { createContactFailureResponse } from "./responses.js";

interface ContactGuardFailure {
  body: ReturnType<typeof createContactFailureResponse>;
  headers?: Record<string, string>;
  status: HttpStatus;
}

const createGuardFailure = (
  status: HttpStatus,
  code: ContactApiErrorCode,
  headers?: Record<string, string>,
): ContactGuardFailure => ({
  body: createContactFailureResponse(code),
  headers,
  status,
});

export const checkContactMethod = (
  req: ApiRequestShape,
  requestContext: RequestContext,
  logSource: string,
) => {
  if (req.method === HTTP_METHOD.POST) {
    return null;
  }

  logInfo(logSource, CONTACT_METHOD_NOT_ALLOWED, {
    ...requestContext,
    method: req.method,
  });

  return createGuardFailure(
    HTTP_STATUS.METHOD_NOT_ALLOWED,
    CONTACT_API_ERROR_CODE.INVALID_REQUEST,
    { Allow: HTTP_METHOD.POST },
  );
};

export const checkContactOrigin = (
  req: ApiRequestShape,
  requestContext: RequestContext,
  logSource: string,
) => {
  const origin = getOriginHeader(req.headers);

  if (isAllowedOrigin(origin)) {
    return null;
  }

  logInfo(logSource, CONTACT_ORIGIN_REJECTED, {
    ...requestContext,
    origin,
  });

  return createGuardFailure(
    HTTP_STATUS.FORBIDDEN,
    CONTACT_API_ERROR_CODE.FORBIDDEN_ORIGIN,
  );
};

const getContentType = (headers: ApiRequestShape["headers"]) =>
  getHeaderValue(headers["content-type"] ?? headers["Content-Type"]);

export const checkContactContentType = (
  req: ApiRequestShape,
  requestContext: RequestContext,
  logSource: string,
) => {
  const contentType = getContentType(req.headers);

  if (contentType?.toLowerCase().includes("application/json")) {
    return null;
  }

  logInfo(logSource, CONTACT_UNSUPPORTED_MEDIA_TYPE, {
    ...requestContext,
    contentType,
  });

  return createGuardFailure(
    HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE,
    CONTACT_API_ERROR_CODE.INVALID_REQUEST,
  );
};

const getRetryAfterSeconds = (reset: number | undefined) => {
  if (reset === undefined || !Number.isFinite(reset)) {
    return undefined;
  }

  return String(Math.max(1, Math.ceil((reset - Date.now()) / 1000)));
};

export const checkContactRateLimit = async (
  req: ApiRequestShape,
  requestContext: RequestContext,
  logSource: string,
) => {
  const origin = getOriginHeader(req.headers);
  let rateLimit: Awaited<ReturnType<typeof isRateLimited>>;

  try {
    rateLimit = await isRateLimited(req.headers);
  } catch (error) {
    logError(logSource, CONTACT_RATE_LIMIT_SKIPPED, error, {
      ...requestContext,
      origin,
    });

    return null;
  }

  if (!rateLimit.limited) {
    return null;
  }

  logInfo(logSource, CONTACT_RATE_LIMITED, {
    ...requestContext,
    origin,
    fingerprintHash: rateLimit.fingerprintHash,
    limit: rateLimit.limit,
    policy: rateLimit.policy,
    window: rateLimit.window,
    remaining: rateLimit.remaining,
    reset: rateLimit.reset,
  });

  const retryAfter = getRetryAfterSeconds(rateLimit.reset);

  return createGuardFailure(
    HTTP_STATUS.TOO_MANY_REQUESTS,
    CONTACT_API_ERROR_CODE.RATE_LIMITED,
    retryAfter ? { "Retry-After": retryAfter } : undefined,
  );
};

export const applyContactGuardFailure = (
  res: ApiResponseShape,
  failure: ContactGuardFailure,
) => {
  for (const [name, value] of Object.entries(failure.headers ?? {})) {
    res.setHeader(name, value);
  }

  return failure;
};
