import { ContactApiErrorCode } from "../../src/shared/contracts/contact.js";
import { sendContactEmail } from "../email/resend/index.js";
import { SendEmailResult } from "../email/types.js";
import { ApiEvent } from "../shared/events.js";
import { HttpMethod, HttpStatus } from "../shared/http.js";
import { getLogSource, logInfo } from "../shared/logger.js";
import { getOriginHeader, isAllowedOrigin } from "../shared/origin.js";
import { createRequestContext } from "../shared/request.js";
import { json } from "../shared/response.js";
import { flushSentry } from "../shared/sentry.js";
import type { ApiRequestShape, ApiResponseShape } from "../shared/types.js";
import { parsePayload } from "./payload.js";
import { isRateLimited } from "./rateLimit.js";
import {
  CONTACT_SUCCESS_RESPONSE,
  createContactFailureResponse,
} from "./responses.js";

const LOG_SOURCE = getLogSource(import.meta.url);

const respond = async (
  res: ApiResponseShape,
  status: HttpStatus,
  body: unknown,
) => {
  await flushSentry();
  return json(res, status, body);
};

const describePayloadShape = (body: unknown) => {
  if (body === null || typeof body !== "object") {
    return {
      bodyType: body === null ? "null" : typeof body,
    };
  }

  const record = body as Record<string, unknown>;

  return {
    bodyType: "object",
    hasName: typeof record.name === "string",
    hasEmail: typeof record.email === "string",
    hasSubject: typeof record.subject === "string",
    hasMessage: typeof record.message === "string",
  };
};

export const handler = async (req: ApiRequestShape, res: ApiResponseShape) => {
  const requestContext = createRequestContext();

  if (req.method !== HttpMethod.Post) {
    logInfo(LOG_SOURCE, ApiEvent.ContactMethodNotAllowed, {
      ...requestContext,
      method: req.method,
    });
    res.setHeader("Allow", HttpMethod.Post);
    return respond(
      res,
      HttpStatus.MethodNotAllowed,
      createContactFailureResponse(ContactApiErrorCode.InvalidRequest),
    );
  }

  const origin = getOriginHeader(req.headers);

  if (!isAllowedOrigin(origin)) {
    logInfo(LOG_SOURCE, ApiEvent.ContactOriginRejected, {
      ...requestContext,
      origin,
    });
    return respond(
      res,
      HttpStatus.Forbidden,
      createContactFailureResponse(ContactApiErrorCode.ForbiddenOrigin),
    );
  }

  const rateLimit = await isRateLimited(req.headers);

  if (rateLimit.limited) {
    logInfo(LOG_SOURCE, ApiEvent.ContactRateLimited, {
      ...requestContext,
      origin,
      fingerprintHash: rateLimit.fingerprintHash,
      limit: rateLimit.limit,
      window: rateLimit.window,
      remaining: rateLimit.remaining,
      reset: rateLimit.reset,
    });
    return respond(
      res,
      HttpStatus.Forbidden,
      createContactFailureResponse(ContactApiErrorCode.RateLimited),
    );
  }

  const payload = parsePayload(req.body);

  if (!payload) {
    logInfo(LOG_SOURCE, ApiEvent.ContactInvalidPayload, {
      ...requestContext,
      ...describePayloadShape(req.body),
    });
    return respond(
      res,
      HttpStatus.BadRequest,
      createContactFailureResponse(ContactApiErrorCode.InvalidRequest),
    );
  }

  if (payload.botcheck !== "") {
    logInfo(LOG_SOURCE, ApiEvent.ContactHoneypotAccepted, {
      ...requestContext,
    });
    return respond(res, HttpStatus.Ok, CONTACT_SUCCESS_RESPONSE);
  }

  const result = await sendContactEmail(payload, requestContext);

  if (result === SendEmailResult.MissingConfig) {
    logInfo(LOG_SOURCE, ApiEvent.ContactDeliveryMissingConfig, {
      ...requestContext,
    });
    return respond(
      res,
      HttpStatus.InternalServerError,
      createContactFailureResponse(ContactApiErrorCode.DeliveryUnavailable),
    );
  }

  if (result !== SendEmailResult.Sent) {
    logInfo(LOG_SOURCE, ApiEvent.ContactDeliveryFailed, {
      ...requestContext,
      result,
    });
    return respond(
      res,
      HttpStatus.BadGateway,
      createContactFailureResponse(ContactApiErrorCode.DeliveryUnavailable),
    );
  }

  logInfo(LOG_SOURCE, ApiEvent.ContactDeliverySent, {
    ...requestContext,
  });
  return respond(res, HttpStatus.Ok, CONTACT_SUCCESS_RESPONSE);
};
