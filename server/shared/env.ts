import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const SERVER_ENV_KEY = {
  ALLOWED_ORIGINS: "ALLOWED_ORIGINS",
  RESEND_API_KEY: "RESEND_API_KEY",
  RESEND_FROM_EMAIL: "RESEND_FROM_EMAIL",
  RESEND_CONTACT_TEMPLATE_ID: "RESEND_CONTACT_TEMPLATE_ID",
  CONTACT_TO_EMAIL: "CONTACT_TO_EMAIL",
  UPSTASH_REDIS_REST_URL: "UPSTASH_REDIS_REST_URL",
  UPSTASH_REDIS_REST_TOKEN: "UPSTASH_REDIS_REST_TOKEN",
} as const;

export type ServerEnvKey = (typeof SERVER_ENV_KEY)[keyof typeof SERVER_ENV_KEY];

interface ServerEnv {
  allowedOrigins: string[];
  resendApiKey: string;
  resendFromEmail: string;
  resendContactTemplateId: string;
  contactToEmail: string;
  upstashRedisRestUrl: string;
  upstashRedisRestToken: string;
}

let cachedServerEnv: ServerEnv | undefined;

const optionalEnvString = z
  .string()
  .optional()
  .transform((value) => value ?? "");

const allowedOriginsSchema = z
  .string()
  .optional()
  .transform((value) =>
    (value ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );

const createRawServerEnv = () =>
  createEnv({
    server: {
      [SERVER_ENV_KEY.ALLOWED_ORIGINS]: allowedOriginsSchema,
      [SERVER_ENV_KEY.RESEND_API_KEY]: optionalEnvString,
      [SERVER_ENV_KEY.RESEND_FROM_EMAIL]: optionalEnvString,
      [SERVER_ENV_KEY.RESEND_CONTACT_TEMPLATE_ID]: optionalEnvString,
      [SERVER_ENV_KEY.CONTACT_TO_EMAIL]: optionalEnvString,
      [SERVER_ENV_KEY.UPSTASH_REDIS_REST_URL]: optionalEnvString,
      [SERVER_ENV_KEY.UPSTASH_REDIS_REST_TOKEN]: optionalEnvString,
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
    isServer: true,
  });

const readServerEnv = (): ServerEnv => {
  const env = createRawServerEnv();

  return {
    allowedOrigins: env.ALLOWED_ORIGINS,
    resendApiKey: env.RESEND_API_KEY,
    resendFromEmail: env.RESEND_FROM_EMAIL,
    resendContactTemplateId: env.RESEND_CONTACT_TEMPLATE_ID,
    contactToEmail: env.CONTACT_TO_EMAIL,
    upstashRedisRestUrl: env.UPSTASH_REDIS_REST_URL,
    upstashRedisRestToken: env.UPSTASH_REDIS_REST_TOKEN,
  };
};

export const getServerEnv = () => {
  if (cachedServerEnv !== undefined) {
    return cachedServerEnv;
  }

  cachedServerEnv = readServerEnv();
  return cachedServerEnv;
};

export const resetServerEnv = () => {
  cachedServerEnv = undefined;
};
