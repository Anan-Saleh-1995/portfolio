interface EmailConfig {
  apiKey: string;
  fromEmail: string;
  toEmail: string;
}

import { ApiEvent } from "../../shared/events";
import { getLogSource, logInfo } from "../../shared/logger";

let cachedConfig: EmailConfig | null | undefined;
const LOG_SOURCE = getLogSource(import.meta.url);

const getEnvString = (value: string | undefined) =>
  typeof value === "string" ? value.trim() : "";

const readEmailConfig = (): EmailConfig | null => {
  const apiKey = getEnvString(process.env.RESEND_API_KEY);
  const fromEmail = getEnvString(process.env.RESEND_FROM_EMAIL);
  const toEmail = getEnvString(process.env.CONTACT_TO_EMAIL);

  logInfo(LOG_SOURCE, ApiEvent.EmailResendConfigCheck, {
    hasApiKey: apiKey !== "",
    hasFromEmail: fromEmail !== "",
    hasToEmail: toEmail !== "",
  });

  if (apiKey === "" || fromEmail === "" || toEmail === "") {
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
