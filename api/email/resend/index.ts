import type { ContactPayload } from "../../contact/types";
import { EmailProvider } from "../providers";
import { ApiEvent } from "../../shared/events";
import { SendEmailResult } from "../types";
import { getResendClient } from "./client";
import { getEmailConfig } from "./config";
import { getLogSource, logError, logInfo } from "../../shared/logger";
import { ResendTemplate } from "./templates";

const LOG_SOURCE = getLogSource(import.meta.url);

export const sendContactEmail = async (
  payload: ContactPayload,
): Promise<SendEmailResult> => {
  const config = getEmailConfig();
  const resend = getResendClient();

  if (!config || !resend) {
    logInfo(LOG_SOURCE, ApiEvent.EmailResendMissingConfig);
    return SendEmailResult.MissingConfig;
  }

  try {
    const { error } = await resend.emails.send({
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
      logInfo(LOG_SOURCE, ApiEvent.EmailResendSent);
      return SendEmailResult.Sent;
    }

    logInfo(LOG_SOURCE, ApiEvent.EmailResendRejected, {
      provider: EmailProvider.Resend,
      message: error.message,
    });
    return SendEmailResult.Failed;
  } catch (error) {
    logError(LOG_SOURCE, ApiEvent.EmailResendException, error, {
      provider: EmailProvider.Resend,
    });
    return SendEmailResult.Failed;
  }
};
