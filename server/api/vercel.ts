import { apiApp } from "../app.js";
import { HTTP_METHOD } from "../shared/http.js";
import type { ApiRequestShape, ApiResponseShape } from "../shared/types.js";

const LOCAL_API_ORIGIN = "http://localhost";

const appendQuery = (url: URL, query: ApiRequestShape["query"] | undefined) => {
  for (const [key, value] of Object.entries(query ?? {})) {
    if (Array.isArray(value)) {
      for (const item of value) {
        url.searchParams.append(key, item);
      }
      continue;
    }

    if (value !== undefined) {
      url.searchParams.append(key, value);
    }
  }
};

const getRequestUrl = (req: ApiRequestShape, fallbackPath: string) => {
  if (req.url) {
    return new URL(req.url, LOCAL_API_ORIGIN);
  }

  const url = new URL(fallbackPath, LOCAL_API_ORIGIN);
  appendQuery(url, req.query);
  return url;
};

const createHeaders = (headers: ApiRequestShape["headers"]) => {
  const result = new Headers();

  for (const [name, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        result.append(name, item);
      }
      continue;
    }

    if (value !== undefined) {
      result.set(name, value);
    }
  }

  return result;
};

const getRequestBody = (req: ApiRequestShape) => {
  const method = req.method?.toUpperCase();

  if (method === HTTP_METHOD.GET || method === HTTP_METHOD.HEAD) {
    return undefined;
  }

  if (req.body === undefined) {
    return undefined;
  }

  if (typeof req.body === "string" || req.body instanceof Uint8Array) {
    return req.body;
  }

  return JSON.stringify(req.body);
};

export const createVercelApiHandler =
  (fallbackPath: string) =>
  async (req: ApiRequestShape, res: ApiResponseShape) => {
    const isHeadRequest = req.method?.toUpperCase() === HTTP_METHOD.HEAD;
    const request = new Request(getRequestUrl(req, fallbackPath), {
      method: req.method,
      headers: createHeaders(req.headers),
      body: getRequestBody(req),
    });
    const response = await apiApp.fetch(request);

    response.headers.forEach((value, name) => {
      res.setHeader(name, value);
    });

    if (isHeadRequest && !response.headers.has("content-length")) {
      res.setHeader("Content-Length", "0");
    }

    res.status(response.status);
    res.send(await response.text());
  };

export const contactApiHandler = createVercelApiHandler("/api/contact");
export const healthApiHandler = createVercelApiHandler("/api/health");
