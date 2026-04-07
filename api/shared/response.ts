import type { ApiResponseShape } from "./types";

export const json = <TBody>(
  res: ApiResponseShape,
  status: number,
  body: TBody,
) => {
  res.status(status).setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(body));
};
