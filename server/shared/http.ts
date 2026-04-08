export const HttpMethod = {
  Get: "GET",
  Post: "POST",
  HEAD: "HEAD",
} as const;
export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod];

export const HttpStatus = {
  Ok: 200,
  BadRequest: 400,
  Forbidden: 403,
  MethodNotAllowed: 405,
  InternalServerError: 500,
  BadGateway: 502,
} as const;
export type HttpStatus = (typeof HttpStatus)[keyof typeof HttpStatus];
