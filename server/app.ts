import { Hono } from "hono";
import {
  handleContact,
  handleContactMethodNotAllowed,
} from "./contact/handler.js";
import {
  handleHealth,
  handleHealthHead,
  handleHealthMethodNotAllowed,
} from "./health/handler.js";
import type { ApiEnv } from "./shared/hono.js";
import { HTTP_METHOD } from "./shared/http.js";
import { createRequestContext } from "./shared/request.js";
import { flushSentry } from "./shared/sentry.js";

export const apiApp = new Hono<ApiEnv>();

apiApp.use("*", async (context, next) => {
  const requestContext = createRequestContext();

  context.set("requestContext", requestContext);
  await next();
  context.header("X-Request-ID", requestContext.requestId);
  void flushSentry();
});

apiApp.on(HTTP_METHOD.GET, "/api/health", handleHealth);
apiApp.on(HTTP_METHOD.HEAD, "/api/health", handleHealthHead);
apiApp.all("/api/health", handleHealthMethodNotAllowed);

apiApp.on(HTTP_METHOD.POST, "/api/contact", handleContact);
apiApp.all("/api/contact", handleContactMethodNotAllowed);
