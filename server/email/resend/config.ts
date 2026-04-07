interface EmailConfig {
  apiKey: string;
  fromEmail: string;
  toEmail: string;
}

import { ApiEvent } from "../../shared/events.js";
import { getServerEnv } from "../../shared/env.js";
import { getLogSource, logInfo } from "../../shared/logger.js";

let cachedConfig: EmailConfig | null | undefined;
const LOG_SOURCE = getLogSource(import.meta.url);

const readEmailConfig = (): EmailConfig | null => {
  const env = getServerEnv();
  const apiKey = env.resendApiKey;
  const fromEmail = env.resendFromEmail;
  const toEmail = env.contactToEmail;

  if (apiKey === "" || fromEmail === "" || toEmail === "") {
    logInfo(LOG_SOURCE, ApiEvent.EmailResendMissingConfig, {
      hasApiKey: apiKey !== "",
      hasFromEmail: fromEmail !== "",
      hasToEmail: toEmail !== "",
    });
    return null;
  }

  return { apiKey, fromEmail, toEmail };
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
