import { HttpMethod, HttpStatus } from "../shared/http.js";
import { json } from "../shared/response.js";
import type { ApiRequestShape, ApiResponseShape } from "../shared/types.js";

const HEALTH_RESPONSE = {
  ok: true,
} as const;

export const handler = async (req: ApiRequestShape, res: ApiResponseShape) => {
  const method = req.method;
  const ALLOW_HEADER = `${HttpMethod.Get}, ${HttpMethod.HEAD}`;

  if (method !== HttpMethod.Get && method !== HttpMethod.HEAD) {
    res.setHeader("Allow", ALLOW_HEADER);
    return json(res, HttpStatus.MethodNotAllowed, HEALTH_RESPONSE);
  }

  if (method === HttpMethod.HEAD) {
    res.status(HttpStatus.Ok).setHeader("Content-Length", "0");
    res.send("");
    return;
  }

  return json(res, HttpStatus.Ok, HEALTH_RESPONSE);
};
