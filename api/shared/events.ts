export const ApiEvent = {
  ContactMethodNotAllowed: "contact.method_not_allowed",
  ContactOriginRejected: "contact.origin_rejected",
  ContactInvalidPayload: "contact.invalid_payload",
  ContactHoneypotAccepted: "contact.honeypot_accepted",
  ContactDeliveryMissingConfig: "contact.delivery_missing_config",
  ContactDeliveryFailed: "contact.delivery_failed",
  ContactDeliverySent: "contact.delivery_sent",
  EmailResendConfigCheck: "email.resend.config_check",
  EmailResendMissingConfig: "email.resend.missing_config",
  EmailResendSent: "email.resend.sent",
  EmailResendRejected: "email.resend.rejected",
  EmailResendException: "email.resend.exception",
} as const;

export type ApiEventName = (typeof ApiEvent)[keyof typeof ApiEvent];
