import type { ContentfulStatusCode } from "hono/utils/http-status";
import { DEFAULT_RESEND_CONTACT_TEMPLATE_ID } from "../email/resend/templates.js";
import { getServerEnv } from "../shared/env.js";
import type { ApiContext } from "../shared/hono.js";
import { HTTP_METHOD, HTTP_STATUS, type HttpStatus } from "../shared/http.js";

const HEALTH_RESPONSE = {
  ok: true,
} as const;
const ALLOW_HEADER = `${HTTP_METHOD.GET}, ${HTTP_METHOD.HEAD}`;

const isTruthyQueryValue = (value: string | undefined) =>
  value === "1" || value?.toLowerCase() === "true";

const isReadinessRequest = (context: ApiContext) =>
  isTruthyQueryValue(context.req.query("ready")) ||
  isTruthyQueryValue(context.req.query("readiness"));

const getContactReadiness = () => {
  const env = getServerEnv();
  const hasAllowedOrigins = env.allowedOrigins.length > 0;
  const hasEmailConfig =
    env.resendApiKey !== "" &&
    env.resendFromEmail !== "" &&
    env.contactToEmail !== "";
  const hasTemplateId =
    (env.resendContactTemplateId || DEFAULT_RESEND_CONTACT_TEMPLATE_ID) !== "";
  const hasRateLimitUrl = env.upstashRedisRestUrl !== "";
  const hasRateLimitToken = env.upstashRedisRestToken !== "";
  const isRateLimitDisabled = !hasRateLimitUrl && !hasRateLimitToken;
  const isRateLimitConfigured = hasRateLimitUrl && hasRateLimitToken;
  const isRateLimitReady = isRateLimitDisabled || isRateLimitConfigured;
  const isReady =
    hasAllowedOrigins && hasEmailConfig && hasTemplateId && isRateLimitReady;

  return {
    ready: isReady,
    allowedOriginsConfigured: hasAllowedOrigins,
    emailConfigured: hasEmailConfig,
    resendTemplateConfigured: hasTemplateId,
    rateLimitConfigured: isRateLimitConfigured,
    rateLimitOptional: true,
    rateLimitReady: isRateLimitReady,
  } as const;
};

const getReadinessResponse = () => {
  const contact = getContactReadiness();

  return {
    ok: contact.ready,
    checks: {
      contact,
    },
  } as const;
};

const json = (context: ApiContext, status: HttpStatus, body: unknown) =>
  context.json(body, status as ContentfulStatusCode);

export const handleHealth = (context: ApiContext) => {
  if (isReadinessRequest(context)) {
    const readinessResponse = getReadinessResponse();

    return json(
      context,
      readinessResponse.ok ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE,
      readinessResponse,
    );
  }

  return json(context, HTTP_STATUS.OK, HEALTH_RESPONSE);
};

export const handleHealthHead = () =>
  new Response("", {
    status: HTTP_STATUS.OK,
    headers: {
      "Content-Length": "0",
    },
  });

export const handleHealthMethodNotAllowed = (context: ApiContext) =>
  context.json(
    HEALTH_RESPONSE,
    HTTP_STATUS.METHOD_NOT_ALLOWED as ContentfulStatusCode,
    {
      Allow: ALLOW_HEADER,
    },
  );
