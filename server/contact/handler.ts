import { ContactApiErrorCode } from "../../src/shared/contracts/contact.js";
import { sendContactEmail } from "../email/resend/index.js";
import { SendEmailResult } from "../email/types.js";
import { ApiEvent } from "../shared/events.js";
import { HttpMethod, HttpStatus } from "../shared/http.js";
import { getLogSource, logInfo } from "../shared/logger.js";
import { getOriginHeader, isAllowedOrigin } from "../shared/origin.js";
import { json } from "../shared/response.js";
import type { ApiRequestShape, ApiResponseShape } from "../shared/types.js";
import { parsePayload } from "./payload.js";
import { isRateLimited } from "./rateLimit.js";
import {
  CONTACT_SUCCESS_RESPONSE,
  createContactFailureResponse,
} from "./responses.js";

const LOG_SOURCE = getLogSource(import.meta.url);

export const handler = async (req: ApiRequestShape, res: ApiResponseShape) => {
  if (req.method !== HttpMethod.Post) {
    logInfo(LOG_SOURCE, ApiEvent.ContactMethodNotAllowed, {
      method: req.method,
    });
    res.setHeader("Allow", HttpMethod.Post);
    return json(
      res,
      HttpStatus.MethodNotAllowed,
      createContactFailureResponse(ContactApiErrorCode.InvalidRequest),
    );
  }

  const origin = getOriginHeader(req.headers);

  if (!isAllowedOrigin(origin)) {
    logInfo(LOG_SOURCE, ApiEvent.ContactOriginRejected, {
      origin,
    });
    return json(
      res,
      HttpStatus.Forbidden,
      createContactFailureResponse(ContactApiErrorCode.ForbiddenOrigin),
    );
  }

  if (await isRateLimited(req.headers)) {
    logInfo(LOG_SOURCE, ApiEvent.ContactRateLimited, {
      origin,
    });
    return json(
      res,
      HttpStatus.Forbidden,
      createContactFailureResponse(ContactApiErrorCode.RateLimited),
    );
  }

  const payload = parsePayload(req.body);

  if (!payload) {
    logInfo(LOG_SOURCE, ApiEvent.ContactInvalidPayload);
    return json(
      res,
      HttpStatus.BadRequest,
      createContactFailureResponse(ContactApiErrorCode.InvalidRequest),
    );
  }

  if (payload.botcheck !== "") {
    logInfo(LOG_SOURCE, ApiEvent.ContactHoneypotAccepted);
    return json(res, HttpStatus.Ok, CONTACT_SUCCESS_RESPONSE);
  }

  const result = await sendContactEmail(payload);

  if (result === SendEmailResult.MissingConfig) {
    logInfo(LOG_SOURCE, ApiEvent.ContactDeliveryMissingConfig);
    return json(
      res,
      HttpStatus.InternalServerError,
      createContactFailureResponse(ContactApiErrorCode.DeliveryUnavailable),
    );
  }

  if (result !== SendEmailResult.Sent) {
    logInfo(LOG_SOURCE, ApiEvent.ContactDeliveryFailed, {
      result,
    });
    return json(
      res,
      HttpStatus.BadGateway,
      createContactFailureResponse(ContactApiErrorCode.DeliveryUnavailable),
    );
  }

  logInfo(LOG_SOURCE, ApiEvent.ContactDeliverySent);
  return json(res, HttpStatus.Ok, CONTACT_SUCCESS_RESPONSE);
};
