import type { ContactPayload } from "../../contact/types.js";
import { EMAIL_PROVIDER } from "../providers.js";
import {
  EMAIL_RESEND_EXCEPTION,
  EMAIL_RESEND_MISSING_CONFIG,
  EMAIL_RESEND_REJECTED,
  EMAIL_RESEND_SENT,
} from "../../shared/events.js";
import { SEND_EMAIL_RESULT, type SendEmailResult } from "../types.js";
import { getResendClient } from "./client.js";
import { getEmailConfig } from "./config.js";
import { getLogSource, logError, logInfo } from "../../shared/logger.js";
import type { RequestContext } from "../../shared/request.js";
import { createContactEmailTemplate } from "./templates.js";

const LOG_SOURCE = getLogSource(import.meta.url);

const getRecordValue = (value: unknown, key: string) => {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }

  return (value as Record<string, unknown>)[key];
};

const getStringValue = (value: unknown, key: string) => {
  const property = getRecordValue(value, key);
  return typeof property === "string" ? property : undefined;
};

const getNumberValue = (value: unknown, key: string) => {
  const property = getRecordValue(value, key);
  return typeof property === "number" ? property : undefined;
};

const getResendErrorMetadata = (error: unknown) => ({
  message: getStringValue(error, "message") ?? "Resend request rejected",
  providerErrorName: getStringValue(error, "name") ?? null,
  providerStatusCode: getNumberValue(error, "statusCode") ?? null,
});

export const sendContactEmail = async (
  payload: ContactPayload,
  requestContext: RequestContext,
): Promise<SendEmailResult> => {
  const config = getEmailConfig();
  const resend = getResendClient();
  const startedAt = Date.now();

  if (!config || !resend) {
    logInfo(LOG_SOURCE, EMAIL_RESEND_MISSING_CONFIG, {
      ...requestContext,
    });
    return SEND_EMAIL_RESULT.MISSING_CONFIG;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: config.fromEmail,
      to: config.toEmail,
      replyTo: payload.email,
      subject: payload.subject,
      template: createContactEmailTemplate(config.contactTemplateId, payload),
    });

    if (error == null) {
      logInfo(LOG_SOURCE, EMAIL_RESEND_SENT, {
        ...requestContext,
        durationMs: Date.now() - startedAt,
        provider: EMAIL_PROVIDER.RESEND,
        providerMessageId: data?.id ?? null,
      });
      return SEND_EMAIL_RESULT.SENT;
    }

    logInfo(LOG_SOURCE, EMAIL_RESEND_REJECTED, {
      ...requestContext,
      durationMs: Date.now() - startedAt,
      provider: EMAIL_PROVIDER.RESEND,
      ...getResendErrorMetadata(error),
    });
    return SEND_EMAIL_RESULT.FAILED;
  } catch (error) {
    logError(LOG_SOURCE, EMAIL_RESEND_EXCEPTION, error, {
      ...requestContext,
      durationMs: Date.now() - startedAt,
      provider: EMAIL_PROVIDER.RESEND,
    });
    return SEND_EMAIL_RESULT.FAILED;
  }
};
