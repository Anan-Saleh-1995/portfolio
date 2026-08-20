import { getEnvString } from "./strings.js";

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

export interface ServerEnv {
  allowedOrigins: string[];
  resendApiKey: string;
  resendFromEmail: string;
  resendContactTemplateId: string;
  contactToEmail: string;
  upstashRedisRestUrl: string;
  upstashRedisRestToken: string;
}

interface EnvFieldSchema<
  TEnvKey extends string,
  TField extends keyof ServerEnv,
> {
  envKey: TEnvKey;
  field: TField;
  parse: (value: string | undefined) => ServerEnv[TField];
}

let cachedServerEnv: ServerEnv | undefined;

const getEnvStringList = (value: string | undefined) =>
  getEnvString(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const envSchema = {
  allowedOrigins: {
    envKey: SERVER_ENV_KEY.ALLOWED_ORIGINS,
    field: "allowedOrigins",
    parse: getEnvStringList,
  },
  resendApiKey: {
    envKey: SERVER_ENV_KEY.RESEND_API_KEY,
    field: "resendApiKey",
    parse: getEnvString,
  },
  resendFromEmail: {
    envKey: SERVER_ENV_KEY.RESEND_FROM_EMAIL,
    field: "resendFromEmail",
    parse: getEnvString,
  },
  resendContactTemplateId: {
    envKey: SERVER_ENV_KEY.RESEND_CONTACT_TEMPLATE_ID,
    field: "resendContactTemplateId",
    parse: getEnvString,
  },
  contactToEmail: {
    envKey: SERVER_ENV_KEY.CONTACT_TO_EMAIL,
    field: "contactToEmail",
    parse: getEnvString,
  },
  upstashRedisRestUrl: {
    envKey: SERVER_ENV_KEY.UPSTASH_REDIS_REST_URL,
    field: "upstashRedisRestUrl",
    parse: getEnvString,
  },
  upstashRedisRestToken: {
    envKey: SERVER_ENV_KEY.UPSTASH_REDIS_REST_TOKEN,
    field: "upstashRedisRestToken",
    parse: getEnvString,
  },
} satisfies {
  allowedOrigins: EnvFieldSchema<"ALLOWED_ORIGINS", "allowedOrigins">;
  resendApiKey: EnvFieldSchema<"RESEND_API_KEY", "resendApiKey">;
  resendFromEmail: EnvFieldSchema<"RESEND_FROM_EMAIL", "resendFromEmail">;
  resendContactTemplateId: EnvFieldSchema<
    "RESEND_CONTACT_TEMPLATE_ID",
    "resendContactTemplateId"
  >;
  contactToEmail: EnvFieldSchema<"CONTACT_TO_EMAIL", "contactToEmail">;
  upstashRedisRestUrl: EnvFieldSchema<
    "UPSTASH_REDIS_REST_URL",
    "upstashRedisRestUrl"
  >;
  upstashRedisRestToken: EnvFieldSchema<
    "UPSTASH_REDIS_REST_TOKEN",
    "upstashRedisRestToken"
  >;
};

const readEnvField = <TEnvKey extends string, TField extends keyof ServerEnv>({
  envKey,
  parse,
}: EnvFieldSchema<TEnvKey, TField>) => parse(process.env[envKey]);

const readServerEnv = (): ServerEnv => {
  return {
    allowedOrigins: readEnvField(envSchema.allowedOrigins),
    resendApiKey: readEnvField(envSchema.resendApiKey),
    resendFromEmail: readEnvField(envSchema.resendFromEmail),
    resendContactTemplateId: readEnvField(envSchema.resendContactTemplateId),
    contactToEmail: readEnvField(envSchema.contactToEmail),
    upstashRedisRestUrl: readEnvField(envSchema.upstashRedisRestUrl),
    upstashRedisRestToken: readEnvField(envSchema.upstashRedisRestToken),
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
