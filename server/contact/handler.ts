import { CONTACT_API_ERROR_CODE } from "../../shared/contact.js";
import { sendContactEmail } from "../email/resend/index.js";
import { SEND_EMAIL_RESULT } from "../email/types.js";
import {
  CONTACT_DELIVERY_FAILED,
  CONTACT_DELIVERY_MISSING_CONFIG,
  CONTACT_DELIVERY_SENT,
  CONTACT_HONEYPOT_ACCEPTED,
  CONTACT_INVALID_PAYLOAD,
} from "../shared/events.js";
import { HTTP_STATUS, type HttpStatus } from "../shared/http.js";
import { getLogSource, logInfo } from "../shared/logger.js";
import {
  createRequestContext,
  type RequestContext,
} from "../shared/request.js";
import { json } from "../shared/response.js";
import { flushSentry } from "../shared/sentry.js";
import type { ApiRequestShape, ApiResponseShape } from "../shared/types.js";
import {
  applyContactGuardFailure,
  checkContactContentType,
  checkContactMethod,
  checkContactOrigin,
  checkContactRateLimit,
} from "./guards.js";
import { parsePayload } from "./payload.js";
import {
  CONTACT_SUCCESS_RESPONSE,
  createContactFailureResponse,
} from "./responses.js";

const LOG_SOURCE = getLogSource(import.meta.url);

const respond = (
  res: ApiResponseShape,
  requestContext: RequestContext,
  status: HttpStatus,
  body: unknown,
) => {
  res.setHeader("X-Request-ID", requestContext.requestId);
  json(res, status, body);
  void flushSentry();
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
  const methodFailure = checkContactMethod(req, requestContext, LOG_SOURCE);

  if (methodFailure) {
    const failure = applyContactGuardFailure(res, methodFailure);
    return respond(res, requestContext, failure.status, failure.body);
  }

  const originFailure = checkContactOrigin(req, requestContext, LOG_SOURCE);

  if (originFailure) {
    const failure = applyContactGuardFailure(res, originFailure);
    return respond(res, requestContext, failure.status, failure.body);
  }

  const contentTypeFailure = checkContactContentType(
    req,
    requestContext,
    LOG_SOURCE,
  );

  if (contentTypeFailure) {
    const failure = applyContactGuardFailure(res, contentTypeFailure);
    return respond(res, requestContext, failure.status, failure.body);
  }

  const payload = parsePayload(req.body);

  if (!payload) {
    logInfo(LOG_SOURCE, CONTACT_INVALID_PAYLOAD, {
      ...requestContext,
      ...describePayloadShape(req.body),
    });
    return respond(
      res,
      requestContext,
      HTTP_STATUS.BAD_REQUEST,
      createContactFailureResponse(CONTACT_API_ERROR_CODE.INVALID_REQUEST),
    );
  }

  if (payload.botcheck !== "") {
    logInfo(LOG_SOURCE, CONTACT_HONEYPOT_ACCEPTED, {
      ...requestContext,
    });
    return respond(
      res,
      requestContext,
      HTTP_STATUS.OK,
      CONTACT_SUCCESS_RESPONSE,
    );
  }

  const rateLimitFailure = await checkContactRateLimit(
    req,
    requestContext,
    LOG_SOURCE,
  );

  if (rateLimitFailure) {
    const failure = applyContactGuardFailure(res, rateLimitFailure);
    return respond(res, requestContext, failure.status, failure.body);
  }

  const result = await sendContactEmail(payload, requestContext);

  if (result === SEND_EMAIL_RESULT.MISSING_CONFIG) {
    logInfo(LOG_SOURCE, CONTACT_DELIVERY_MISSING_CONFIG, {
      ...requestContext,
    });
    return respond(
      res,
      requestContext,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      createContactFailureResponse(CONTACT_API_ERROR_CODE.DELIVERY_UNAVAILABLE),
    );
  }

  if (result !== SEND_EMAIL_RESULT.SENT) {
    logInfo(LOG_SOURCE, CONTACT_DELIVERY_FAILED, {
      ...requestContext,
      result,
    });
    return respond(
      res,
      requestContext,
      HTTP_STATUS.BAD_GATEWAY,
      createContactFailureResponse(CONTACT_API_ERROR_CODE.DELIVERY_UNAVAILABLE),
    );
  }

  logInfo(LOG_SOURCE, CONTACT_DELIVERY_SENT, {
    ...requestContext,
  });
  return respond(res, requestContext, HTTP_STATUS.OK, CONTACT_SUCCESS_RESPONSE);
};
