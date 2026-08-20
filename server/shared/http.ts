export const HTTP_METHOD = {
  GET: "GET",
  POST: "POST",
  HEAD: "HEAD",
} as const;
export type HttpMethod = (typeof HTTP_METHOD)[keyof typeof HTTP_METHOD];

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  TOO_MANY_REQUESTS: 429,
  UNSUPPORTED_MEDIA_TYPE: 415,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;
export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
