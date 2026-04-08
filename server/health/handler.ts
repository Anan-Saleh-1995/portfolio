import { HttpMethod, HttpStatus } from "../shared/http.js";
import { json } from "../shared/response.js";
import type { ApiRequestShape, ApiResponseShape } from "../shared/types.js";

const HEALTH_RESPONSE = {
  ok: true,
} as const;

export const handler = async (req: ApiRequestShape, res: ApiResponseShape) => {
  if (req.method !== HttpMethod.Get) {
    res.setHeader("Allow", HttpMethod.Get);
    return json(res, HttpStatus.MethodNotAllowed, HEALTH_RESPONSE);
  }

  return json(res, HttpStatus.Ok, HEALTH_RESPONSE);
};
