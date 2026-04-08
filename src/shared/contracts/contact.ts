export const CONTACT_API_ERROR_CODE = {
  INVALID_REQUEST: "INVALID_REQUEST",
  FORBIDDEN_ORIGIN: "FORBIDDEN_ORIGIN",
  RATE_LIMITED: "RATE_LIMITED",
  DELIVERY_UNAVAILABLE: "DELIVERY_UNAVAILABLE",
} as const;

export type ContactApiErrorCode =
  (typeof CONTACT_API_ERROR_CODE)[keyof typeof CONTACT_API_ERROR_CODE];

export type ContactApiResponse =
  | { success: true }
  | {
      success: false;
      code: ContactApiErrorCode;
    };
