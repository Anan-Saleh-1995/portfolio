import { HTTP_METHOD, HTTP_STATUS } from "../shared/http.js";
import { json } from "../shared/response.js";
import type { ApiRequestShape, ApiResponseShape } from "../shared/types.js";

const HEALTH_RESPONSE = {
  ok: true,
} as const;

export const handler = async (req: ApiRequestShape, res: ApiResponseShape) => {
  const method = req.method;
  const ALLOW_HEADER = `${HTTP_METHOD.GET}, ${HTTP_METHOD.HEAD}`;

  if (method !== HTTP_METHOD.GET && method !== HTTP_METHOD.HEAD) {
    res.setHeader("Allow", ALLOW_HEADER);
    return json(res, HTTP_STATUS.METHOD_NOT_ALLOWED, HEALTH_RESPONSE);
  }

  if (method === HTTP_METHOD.HEAD) {
    res.status(HTTP_STATUS.OK).setHeader("Content-Length", "0");
    res.send("");
    return;
  }

  return json(res, HTTP_STATUS.OK, HEALTH_RESPONSE);
};
