import { HTTP_METHOD, HTTP_STATUS } from "../shared/http.js";
import { createRequestContext } from "../shared/request.js";
import { json } from "../shared/response.js";
import type { ApiRequestShape, ApiResponseShape } from "../shared/types.js";
import { getServerEnv } from "../shared/env.js";
import { DEFAULT_RESEND_CONTACT_TEMPLATE_ID } from "../email/resend/templates.js";

const HEALTH_RESPONSE = {
  ok: true,
} as const;
const ALLOW_HEADER = `${HTTP_METHOD.GET}, ${HTTP_METHOD.HEAD}`;

const getQueryValue = (
  req: ApiRequestShape,
  key: string,
): string | undefined => {
  const queryValue = req.query?.[key];

  if (Array.isArray(queryValue)) {
    return queryValue[0];
  }

  if (queryValue !== undefined) {
    return queryValue;
  }

  if (!req.url) {
    return undefined;
  }

  try {
    return (
      new URL(req.url, "http://localhost").searchParams.get(key) ?? undefined
    );
  } catch {
    return undefined;
  }
};

const isTruthyQueryValue = (value: string | undefined) =>
  value === "1" || value?.toLowerCase() === "true";

const isReadinessRequest = (req: ApiRequestShape) =>
  isTruthyQueryValue(getQueryValue(req, "ready")) ||
  isTruthyQueryValue(getQueryValue(req, "readiness"));

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

export const handler = (req: ApiRequestShape, res: ApiResponseShape) => {
  const requestContext = createRequestContext();
  const method = req.method;

  res.setHeader("X-Request-ID", requestContext.requestId);

  if (method !== HTTP_METHOD.GET && method !== HTTP_METHOD.HEAD) {
    res.setHeader("Allow", ALLOW_HEADER);
    return json(res, HTTP_STATUS.METHOD_NOT_ALLOWED, HEALTH_RESPONSE);
  }

  if (method === HTTP_METHOD.HEAD) {
    res.status(HTTP_STATUS.OK).setHeader("Content-Length", "0");
    res.send("");
    return;
  }

  if (isReadinessRequest(req)) {
    const readinessResponse = getReadinessResponse();
    return json(
      res,
      readinessResponse.ok ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE,
      readinessResponse,
    );
  }

  return json(res, HTTP_STATUS.OK, HEALTH_RESPONSE);
};
