import type { ContactPayload } from "../../contact/types.js";
import { EmailProvider } from "../providers.js";
import { ApiEvent } from "../../shared/events.js";
import { SendEmailResult } from "../types.js";
import { getResendClient } from "./client.js";
import { getEmailConfig } from "./config.js";
import { getLogSource, logError, logInfo } from "../../shared/logger.js";
import { ResendTemplate } from "./templates.js";

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
