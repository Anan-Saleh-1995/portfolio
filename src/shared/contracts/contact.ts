export const ContactApiErrorCode = {
  InvalidRequest: "INVALID_REQUEST",
  ForbiddenOrigin: "FORBIDDEN_ORIGIN",
  RateLimited: "RATE_LIMITED",
  DeliveryUnavailable: "DELIVERY_UNAVAILABLE",
} as const;

export type ContactApiErrorCode =
  (typeof ContactApiErrorCode)[keyof typeof ContactApiErrorCode];

export type ContactApiResponse =
  | { success: true }
  | {
      success: false;
      code: ContactApiErrorCode;
    };
