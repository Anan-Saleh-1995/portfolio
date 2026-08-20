import type { Context } from "hono";
import type { RequestContext } from "./request.js";

export interface ApiVariables {
  requestContext: RequestContext;
}

export interface ApiEnv {
  Variables: ApiVariables;
}

export type ApiContext = Context<ApiEnv>;

export const getApiRequestContext = (context: ApiContext) =>
  context.get("requestContext");
