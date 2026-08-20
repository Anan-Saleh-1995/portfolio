import type { ContentfulStatusCode } from "hono/utils/http-status";
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
import type { ApiContext } from "../shared/hono.js";
import { getApiRequestContext } from "../shared/hono.js";
import { HTTP_STATUS, type HttpStatus } from "../shared/http.js";
import { getLogSource, logInfo } from "../shared/logger.js";
import type { ApiRequestShape } from "../shared/types.js";
import {
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

const getHeadersShape = (headers: Headers): ApiRequestShape["headers"] => {
  const result: ApiRequestShape["headers"] = {};

  headers.forEach((value, key) => {
    result[key] = value;
  });

  return result;
};

const getRequestShape = (
  context: ApiContext,
  body?: unknown,
): ApiRequestShape => ({
  method: context.req.method,
  headers: getHeadersShape(context.req.raw.headers),
  body,
  url: new URL(context.req.url).pathname,
});

const respond = (
  context: ApiContext,
  status: HttpStatus,
  body: unknown,
  headers?: Record<string, string>,
) => context.json(body, status as ContentfulStatusCode, headers);

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

const readJsonBody = async (context: ApiContext): Promise<unknown> => {
  try {
    const body: unknown = await context.req.json();
    return body;
  } catch {
    return undefined;
  }
};

export const handleContactMethodNotAllowed = (context: ApiContext) => {
  const requestContext = getApiRequestContext(context);
  const methodFailure = checkContactMethod(
    getRequestShape(context),
    requestContext,
    LOG_SOURCE,
  );

  return respond(
    context,
    methodFailure?.status ?? HTTP_STATUS.METHOD_NOT_ALLOWED,
    methodFailure?.body ??
      createContactFailureResponse(CONTACT_API_ERROR_CODE.INVALID_REQUEST),
    methodFailure?.headers,
  );
};

export const handleContact = async (context: ApiContext) => {
  const requestContext = getApiRequestContext(context);
  const requestWithoutBody = getRequestShape(context);
  const methodFailure = checkContactMethod(
    requestWithoutBody,
    requestContext,
    LOG_SOURCE,
  );

  if (methodFailure) {
    return respond(
      context,
      methodFailure.status,
      methodFailure.body,
      methodFailure.headers,
    );
  }

  const originFailure = checkContactOrigin(
    requestWithoutBody,
    requestContext,
    LOG_SOURCE,
  );

  if (originFailure) {
    return respond(context, originFailure.status, originFailure.body);
  }

  const contentTypeFailure = checkContactContentType(
    requestWithoutBody,
    requestContext,
    LOG_SOURCE,
  );

  if (contentTypeFailure) {
    return respond(context, contentTypeFailure.status, contentTypeFailure.body);
  }

  const body: unknown = await readJsonBody(context);
  const requestWithBody = getRequestShape(context, body);
  const payload = parsePayload(body);

  if (!payload) {
    logInfo(LOG_SOURCE, CONTACT_INVALID_PAYLOAD, {
      ...requestContext,
      ...describePayloadShape(body),
    });
    return respond(
      context,
      HTTP_STATUS.BAD_REQUEST,
      createContactFailureResponse(CONTACT_API_ERROR_CODE.INVALID_REQUEST),
    );
  }

  if (payload.botcheck !== "") {
    logInfo(LOG_SOURCE, CONTACT_HONEYPOT_ACCEPTED, {
      ...requestContext,
    });
    return respond(context, HTTP_STATUS.OK, CONTACT_SUCCESS_RESPONSE);
  }

  const rateLimitFailure = await checkContactRateLimit(
    requestWithBody,
    requestContext,
    LOG_SOURCE,
  );

  if (rateLimitFailure) {
    return respond(
      context,
      rateLimitFailure.status,
      rateLimitFailure.body,
      rateLimitFailure.headers,
    );
  }

  const result = await sendContactEmail(payload, requestContext);

  if (result === SEND_EMAIL_RESULT.MISSING_CONFIG) {
    logInfo(LOG_SOURCE, CONTACT_DELIVERY_MISSING_CONFIG, {
      ...requestContext,
    });
    return respond(
      context,
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
      context,
      HTTP_STATUS.BAD_GATEWAY,
      createContactFailureResponse(CONTACT_API_ERROR_CODE.DELIVERY_UNAVAILABLE),
    );
  }

  logInfo(LOG_SOURCE, CONTACT_DELIVERY_SENT, {
    ...requestContext,
  });
  return respond(context, HTTP_STATUS.OK, CONTACT_SUCCESS_RESPONSE);
};
