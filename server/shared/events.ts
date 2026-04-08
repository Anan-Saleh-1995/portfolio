export const ApiEvent = {
  SharedEnvMissing: "shared.env_missing",
  SharedSentryDisabled: "shared.sentry_disabled",
  SharedSentryInitialized: "shared.sentry_initialized",
  SharedSentryReported: "shared.sentry_reported",
  ContactMethodNotAllowed: "contact.method_not_allowed",
  ContactOriginRejected: "contact.origin_rejected",
  ContactRateLimited: "contact.rate_limited",
  ContactInvalidPayload: "contact.invalid_payload",
  ContactHoneypotAccepted: "contact.honeypot_accepted",
  ContactDeliveryMissingConfig: "contact.delivery_missing_config",
  ContactDeliveryFailed: "contact.delivery_failed",
  ContactDeliverySent: "contact.delivery_sent",
  EmailResendMissingConfig: "email.resend.missing_config",
  EmailResendSent: "email.resend.sent",
  EmailResendRejected: "email.resend.rejected",
  EmailResendException: "email.resend.exception",
} as const;

export type ApiEventName = (typeof ApiEvent)[keyof typeof ApiEvent];
