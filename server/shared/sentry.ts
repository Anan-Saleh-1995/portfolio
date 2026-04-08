import * as Sentry from "@sentry/node";
import { ApiEvent } from "./events.js";
import { getEnvString } from "./strings.js";

const SENTRY_ALERT_CODE = {
  SHARED_ENV_MISSING: "SHARED_ENV_MISSING",
  EMAIL_RESEND_MISSING_CONFIG: "EMAIL_RESEND_MISSING_CONFIG",
  EMAIL_RESEND_REJECTED: "EMAIL_RESEND_REJECTED",
  EMAIL_RESEND_EXCEPTION: "EMAIL_RESEND_EXCEPTION",
} as const;

const SENTRY_ALERT_MESSAGES = {
  SHARED_ENV_MISSING: "Server environment is missing required variables.",
  EMAIL_RESEND_MISSING_CONFIG: "Contact email delivery is misconfigured.",
  EMAIL_RESEND_REJECTED: "Resend rejected contact email.",
  EMAIL_RESEND_EXCEPTION: "Contact email delivery threw an exception.",
} as const;

type SentryAlertCode =
  (typeof SENTRY_ALERT_CODE)[keyof typeof SENTRY_ALERT_CODE];

const getSentryDsn = () => getEnvString(process.env.SENTRY_DSN);
const LOG_SOURCE = "sentry.ts";

const highSignalInfoEvents = new Set<string>([
  ApiEvent.SharedEnvMissing,
  ApiEvent.EmailResendMissingConfig,
  ApiEvent.EmailResendRejected,
]);

let initialized = false;
let disabledLogged = false;
let initializedLogged = false;

const getAlertCode = (event: string): SentryAlertCode | null => {
  switch (event) {
    case ApiEvent.SharedEnvMissing:
      return SENTRY_ALERT_CODE.SHARED_ENV_MISSING;
    case ApiEvent.EmailResendMissingConfig:
      return SENTRY_ALERT_CODE.EMAIL_RESEND_MISSING_CONFIG;
    case ApiEvent.EmailResendRejected:
      return SENTRY_ALERT_CODE.EMAIL_RESEND_REJECTED;
    case ApiEvent.EmailResendException:
      return SENTRY_ALERT_CODE.EMAIL_RESEND_EXCEPTION;
    default:
      return null;
  }
};

const getAlertMessage = (event: string) => {
  const alertCode = getAlertCode(event);

  if (!alertCode) {
    return event;
  }

  return SENTRY_ALERT_MESSAGES[alertCode];
};

const logSentryInfo = (
  event: string,
  metadata: Record<string, unknown> = {},
) => {
  console.info({
    scope: "api",
    source: LOG_SOURCE,
    event,
    ...metadata,
  });
};

const ensureSentry = () => {
  const dsn = getSentryDsn();

  if (initialized) {
    return true;
  }

  if (dsn === "") {
    if (!disabledLogged) {
      logSentryInfo(ApiEvent.SharedSentryDisabled, {
        hasDsn: false,
      });
      disabledLogged = true;
    }

    return dsn !== "";
  }

  const environment =
    getEnvString(process.env.VERCEL_ENV) ||
    getEnvString(process.env.NODE_ENV) ||
    "development";

  Sentry.init({
    dsn,
    environment,
    sendDefaultPii: false,
    tracesSampleRate: 0,
  });

  initialized = true;

  if (!initializedLogged) {
    logSentryInfo(ApiEvent.SharedSentryInitialized, {
      environment,
    });
    initializedLogged = true;
  }

  return true;
};

const withScope = (
  source: string,
  event: string,
  metadata: Record<string, unknown>,
  callback: () => void,
) => {
  if (!ensureSentry()) {
    return;
  }

  Sentry.withScope((scope) => {
    scope.setTag("source", source);
    scope.setTag("event", event);
    scope.setTag("alertCode", getAlertCode(event) ?? "UNKNOWN");

    for (const [key, value] of Object.entries(metadata)) {
      scope.setExtra(key, value);
    }

    callback();
  });
};

export const reportInfoToSentry = (
  source: string,
  event: string,
  metadata: Record<string, unknown>,
) => {
  if (!highSignalInfoEvents.has(event)) {
    return;
  }

  withScope(source, event, metadata, () => {
    Sentry.captureMessage(getAlertMessage(event), "warning");
    logSentryInfo(ApiEvent.SharedSentryReported, {
      level: "warning",
      targetEvent: event,
      targetSource: source,
      requestId: metadata.requestId ?? null,
    });
  });
};

export const reportErrorToSentry = (
  source: string,
  event: string,
  error: unknown,
  metadata: Record<string, unknown>,
) => {
  withScope(source, event, metadata, () => {
    if (error instanceof Error) {
      Sentry.captureException(error);
      logSentryInfo(ApiEvent.SharedSentryReported, {
        level: "error",
        targetEvent: event,
        targetSource: source,
        requestId: metadata.requestId ?? null,
        errorName: error.name,
      });
      return;
    }

    Sentry.captureMessage(getAlertMessage(event), "error");
    logSentryInfo(ApiEvent.SharedSentryReported, {
      level: "error",
      targetEvent: event,
      targetSource: source,
      requestId: metadata.requestId ?? null,
      errorName: "UnknownError",
    });
  });
};

export const flushSentry = async (timeout = 2000) => {
  if (!initialized) {
    return;
  }

  await Sentry.flush(timeout);
};
