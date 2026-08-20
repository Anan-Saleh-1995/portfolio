import { describe, expect, it } from "vitest";
import { HTTP_METHOD, HTTP_STATUS } from "../shared/http.js";
import type { ApiResponseShape } from "../shared/types.js";
import { healthApiHandler } from "./vercel.js";

const createResponse = (): ApiResponseShape & {
  body: string;
  headers: Record<string, string>;
  statusCode: number;
} => ({
  body: "",
  headers: {},
  statusCode: 200,
  status(code: number) {
    this.statusCode = code;
    return this;
  },
  setHeader(name: string, value: string) {
    this.headers[name] = value;
    return this;
  },
  send(body: string) {
    this.body = body;
  },
});

describe("vercel api adapter", () => {
  it("bridges Vercel-style requests to the Hono app", async () => {
    const response = createResponse();

    await healthApiHandler(
      {
        method: HTTP_METHOD.GET,
        headers: {},
      },
      response,
    );

    expect(response.statusCode).toBe(HTTP_STATUS.OK);
    expect(response.headers["x-request-id"]).toEqual(expect.any(String));
    expect(JSON.parse(response.body)).toEqual({ ok: true });
  });

  it("preserves the public empty head response metadata", async () => {
    const response = createResponse();

    await healthApiHandler(
      {
        method: HTTP_METHOD.HEAD,
        headers: {},
      },
      response,
    );

    expect(response.statusCode).toBe(HTTP_STATUS.OK);
    expect(response.headers["Content-Length"]).toBe("0");
    expect(response.body).toBe("");
  });
});
