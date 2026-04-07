import { Resend } from "resend";
import { getEmailConfig } from "./config.js";

let cachedClient: Resend | null | undefined;

export const getResendClient = () => {
  if (cachedClient !== undefined) {
    return cachedClient;
  }

  const config = getEmailConfig();

  if (!config) {
    cachedClient = null;
    return cachedClient;
  }

  cachedClient = new Resend(config.apiKey);
  return cachedClient;
};

export const resetResendClient = () => {
  cachedClient = undefined;
};
