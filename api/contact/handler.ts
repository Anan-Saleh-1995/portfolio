import { sendContactEmail } from "../email/resend";
import { SendEmailResult } from "../email/types";
import { ApiEvent } from "../shared/events";
import { HttpMethod, HttpStatus } from "../shared/http";
import { getLogSource, logInfo } from "../shared/logger";
import { getOriginHeader, isAllowedOrigin } from "../shared/origin";
import { json } from "../shared/response";
import type { ApiRequestShape, ApiResponseShape } from "../shared/types";
import { parsePayload } from "./payload";
import {
  CONTACT_FAILURE_RESPONSE,
  CONTACT_SUCCESS_RESPONSE,
} from "./responses";

const LOG_SOURCE = getLogSource(import.meta.url);

export const handler = async (req: ApiRequestShape, res: ApiResponseShape) => {
  if (req.method !== HttpMethod.Post) {
    logInfo(LOG_SOURCE, ApiEvent.ContactMethodNotAllowed, {
      method: req.method,
    });
    res.setHeader("Allow", HttpMethod.Post);
    return json(res, HttpStatus.MethodNotAllowed, CONTACT_FAILURE_RESPONSE);
  }

  const origin = getOriginHeader(req.headers);

  if (!isAllowedOrigin(origin)) {
    logInfo(LOG_SOURCE, ApiEvent.ContactOriginRejected, {
      origin,
    });
    return json(res, HttpStatus.Forbidden, CONTACT_FAILURE_RESPONSE);
  }

  const payload = parsePayload(req.body);

  if (!payload) {
    logInfo(LOG_SOURCE, ApiEvent.ContactInvalidPayload);
    return json(res, HttpStatus.BadRequest, CONTACT_FAILURE_RESPONSE);
  }

  if (payload.botcheck !== "") {
    logInfo(LOG_SOURCE, ApiEvent.ContactHoneypotAccepted);
    return json(res, HttpStatus.Ok, CONTACT_SUCCESS_RESPONSE);
  }

  const result = await sendContactEmail(payload);

  if (result === SendEmailResult.MissingConfig) {
    logInfo(LOG_SOURCE, ApiEvent.ContactDeliveryMissingConfig);
    return json(res, HttpStatus.InternalServerError, CONTACT_FAILURE_RESPONSE);
  }

  if (result !== SendEmailResult.Sent) {
    logInfo(LOG_SOURCE, ApiEvent.ContactDeliveryFailed, {
      result,
    });
    return json(res, HttpStatus.BadGateway, CONTACT_FAILURE_RESPONSE);
  }

  logInfo(LOG_SOURCE, ApiEvent.ContactDeliverySent);
  return json(res, HttpStatus.Ok, CONTACT_SUCCESS_RESPONSE);
};
