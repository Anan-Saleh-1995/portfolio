import {
  CONTACT_API_ERROR_CODE,
  type ContactApiErrorCode,
} from "../../src/shared/contracts/contact.js";
import {
  CONTACT_METHOD_NOT_ALLOWED,
  CONTACT_ORIGIN_REJECTED,
  CONTACT_RATE_LIMITED,
} from "../shared/events.js";
import { HTTP_METHOD, HTTP_STATUS, type HttpStatus } from "../shared/http.js";
import { logInfo } from "../shared/logger.js";
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

export const checkContactRateLimit = async (
  req: ApiRequestShape,
  requestContext: RequestContext,
  logSource: string,
) => {
  const origin = getOriginHeader(req.headers);
  const rateLimit = await isRateLimited(req.headers);

  if (!rateLimit.limited) {
    return null;
  }

  logInfo(logSource, CONTACT_RATE_LIMITED, {
    ...requestContext,
    origin,
    fingerprintHash: rateLimit.fingerprintHash,
    limit: rateLimit.limit,
    window: rateLimit.window,
    remaining: rateLimit.remaining,
    reset: rateLimit.reset,
  });

  return createGuardFailure(
    HTTP_STATUS.FORBIDDEN,
    CONTACT_API_ERROR_CODE.RATE_LIMITED,
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
