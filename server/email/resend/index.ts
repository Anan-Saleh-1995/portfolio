import type { ContactPayload } from "../../contact/types.js";
import { EmailProvider } from "../providers.js";
import {
  EMAIL_RESEND_EXCEPTION,
  EMAIL_RESEND_MISSING_CONFIG,
  EMAIL_RESEND_REJECTED,
  EMAIL_RESEND_SENT,
} from "../../shared/events.js";
import { SendEmailResult } from "../types.js";
import { getResendClient } from "./client.js";
import { getEmailConfig } from "./config.js";
import { getLogSource, logError, logInfo } from "../../shared/logger.js";
import type { RequestContext } from "../../shared/request.js";
import { ResendTemplate } from "./templates.js";

const LOG_SOURCE = getLogSource(import.meta.url);

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
    return SendEmailResult.MissingConfig;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: config.fromEmail,
      to: config.toEmail,
      replyTo: payload.email,
      subject: payload.subject,
      template: {
        id: ResendTemplate.DirectWord,
        variables: {
          name: payload.name,
          email: payload.email,
          subject: payload.subject,
          message: payload.message,
        },
      },
    });

    if (error == null) {
      logInfo(LOG_SOURCE, EMAIL_RESEND_SENT, {
        ...requestContext,
        durationMs: Date.now() - startedAt,
        provider: EmailProvider.Resend,
        providerMessageId: data?.id ?? null,
      });
      return SendEmailResult.Sent;
    }

    logInfo(LOG_SOURCE, EMAIL_RESEND_REJECTED, {
      ...requestContext,
      durationMs: Date.now() - startedAt,
      provider: EmailProvider.Resend,
      message: error.message,
    });
    return SendEmailResult.Failed;
  } catch (error) {
    logError(LOG_SOURCE, EMAIL_RESEND_EXCEPTION, error, {
      ...requestContext,
      durationMs: Date.now() - startedAt,
      provider: EmailProvider.Resend,
    });
    return SendEmailResult.Failed;
  }
};
