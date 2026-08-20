interface EmailConfig {
  apiKey: string;
  fromEmail: string;
  contactTemplateId: string;
  toEmail: string;
}

import { EMAIL_RESEND_MISSING_CONFIG } from "../../shared/events.js";
import { getServerEnv } from "../../shared/env.js";
import { getLogSource, logInfo } from "../../shared/logger.js";
import { DEFAULT_RESEND_CONTACT_TEMPLATE_ID } from "./templates.js";

let cachedConfig: EmailConfig | null | undefined;
const LOG_SOURCE = getLogSource(import.meta.url);

const readEmailConfig = (): EmailConfig | null => {
  const env = getServerEnv();
  const apiKey = env.resendApiKey;
  const fromEmail = env.resendFromEmail;
  const contactTemplateId =
    env.resendContactTemplateId || DEFAULT_RESEND_CONTACT_TEMPLATE_ID;
  const toEmail = env.contactToEmail;

  if (apiKey === "" || fromEmail === "" || toEmail === "") {
    logInfo(LOG_SOURCE, EMAIL_RESEND_MISSING_CONFIG, {
      hasApiKey: apiKey !== "",
      hasFromEmail: fromEmail !== "",
      hasToEmail: toEmail !== "",
    });
    return null;
  }

  return { apiKey, fromEmail, contactTemplateId, toEmail };
};

export const getEmailConfig = () => {
  if (cachedConfig !== undefined) {
    return cachedConfig;
  }

  cachedConfig = readEmailConfig();
  return cachedConfig;
};

export const resetEmailConfig = () => {
  cachedConfig = undefined;
};
