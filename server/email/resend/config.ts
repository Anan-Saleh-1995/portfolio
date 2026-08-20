interface EmailConfig {
  apiKey: string;
  fromEmail: string;
  contactTemplateId: string;
  toEmail: string;
}

import { EMAIL_RESEND_MISSING_CONFIG } from "../../shared/events.js";
import {
  getServerEnv,
  SERVER_ENV_KEY,
  type ServerEnvKey,
} from "../../shared/env.js";
import { getLogSource, logInfo } from "../../shared/logger.js";
import { DEFAULT_RESEND_CONTACT_TEMPLATE_ID } from "./templates.js";

let cachedConfig: EmailConfig | null | undefined;
const LOG_SOURCE = getLogSource(import.meta.url);
const REQUIRED_EMAIL_ENV_KEYS = [
  SERVER_ENV_KEY.RESEND_API_KEY,
  SERVER_ENV_KEY.RESEND_FROM_EMAIL,
  SERVER_ENV_KEY.CONTACT_TO_EMAIL,
] as const;

const getMissingEmailEnvKeys = (
  env: ReturnType<typeof getServerEnv>,
): ServerEnvKey[] =>
  REQUIRED_EMAIL_ENV_KEYS.filter((key) => {
    switch (key) {
      case SERVER_ENV_KEY.RESEND_API_KEY:
        return env.resendApiKey === "";
      case SERVER_ENV_KEY.RESEND_FROM_EMAIL:
        return env.resendFromEmail === "";
      case SERVER_ENV_KEY.CONTACT_TO_EMAIL:
        return env.contactToEmail === "";
    }
  });

const readEmailConfig = (): EmailConfig | null => {
  const env = getServerEnv();
  const apiKey = env.resendApiKey;
  const fromEmail = env.resendFromEmail;
  const contactTemplateId =
    env.resendContactTemplateId || DEFAULT_RESEND_CONTACT_TEMPLATE_ID;
  const toEmail = env.contactToEmail;
  const missing = getMissingEmailEnvKeys(env);

  if (missing.length > 0) {
    logInfo(LOG_SOURCE, EMAIL_RESEND_MISSING_CONFIG, {
      missing,
      hasApiKey: apiKey !== "",
      hasFromEmail: fromEmail !== "",
      hasTemplateId: contactTemplateId !== "",
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
