import { ApiEvent } from "./events";
import { getLogSource, logInfo } from "./logger";
import { getEnvString } from "./strings";

interface ServerEnv {
  allowedOrigins: string[];
  resendApiKey: string;
  resendFromEmail: string;
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
  isMissing: (value: ServerEnv[TField]) => boolean;
}

let cachedServerEnv: ServerEnv | undefined;
const LOG_SOURCE = getLogSource(import.meta.url);

const getEnvStringList = (value: string | undefined) =>
  getEnvString(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const envSchema = {
  allowedOrigins: {
    envKey: "ALLOWED_ORIGINS",
    field: "allowedOrigins",
    parse: getEnvStringList,
    isMissing: (value) => value.length === 0,
  },
  resendApiKey: {
    envKey: "RESEND_API_KEY",
    field: "resendApiKey",
    parse: getEnvString,
    isMissing: (value) => value === "",
  },
  resendFromEmail: {
    envKey: "RESEND_FROM_EMAIL",
    field: "resendFromEmail",
    parse: getEnvString,
    isMissing: (value) => value === "",
  },
  contactToEmail: {
    envKey: "CONTACT_TO_EMAIL",
    field: "contactToEmail",
    parse: getEnvString,
    isMissing: (value) => value === "",
  },
  upstashRedisRestUrl: {
    envKey: "UPSTASH_REDIS_REST_URL",
    field: "upstashRedisRestUrl",
    parse: getEnvString,
    isMissing: (value) => value === "",
  },
  upstashRedisRestToken: {
    envKey: "UPSTASH_REDIS_REST_TOKEN",
    field: "upstashRedisRestToken",
    parse: getEnvString,
    isMissing: (value) => value === "",
  },
} satisfies {
  allowedOrigins: EnvFieldSchema<"ALLOWED_ORIGINS", "allowedOrigins">;
  resendApiKey: EnvFieldSchema<"RESEND_API_KEY", "resendApiKey">;
  resendFromEmail: EnvFieldSchema<"RESEND_FROM_EMAIL", "resendFromEmail">;
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

const readEnvField = <TEnvKey extends string, TField extends keyof ServerEnv>(
  missing: string[],
  schema: EnvFieldSchema<TEnvKey, TField>,
) => {
  const parsedValue = schema.parse(process.env[schema.envKey]);

  if (schema.isMissing(parsedValue)) {
    missing.push(schema.envKey);
  }

  return parsedValue;
};

const readServerEnv = (): ServerEnv => {
  const missing: string[] = [];
  const env: ServerEnv = {
    allowedOrigins: readEnvField(missing, envSchema.allowedOrigins),
    resendApiKey: readEnvField(missing, envSchema.resendApiKey),
    resendFromEmail: readEnvField(missing, envSchema.resendFromEmail),
    contactToEmail: readEnvField(missing, envSchema.contactToEmail),
    upstashRedisRestUrl: readEnvField(missing, envSchema.upstashRedisRestUrl),
    upstashRedisRestToken: readEnvField(
      missing,
      envSchema.upstashRedisRestToken,
    ),
  };

  if (missing.length > 0) {
    logInfo(LOG_SOURCE, ApiEvent.SharedEnvMissing, {
      missing,
    });
  }

  return env;
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
