import type { ApiResponseShape } from "./types.js";

export const json = <TBody>(
  res: ApiResponseShape,
  status: number,
  body: TBody,
) => {
  res.status(status).setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(body));
};
