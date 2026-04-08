import { createHash, randomUUID } from "node:crypto";
import { getRequestFingerprint } from "./headers.js";
import type { ApiRequestShape } from "./types.js";

export interface RequestContext {
  requestId: string;
}

export const createRequestContext = (): RequestContext => ({
  requestId: randomUUID(),
});

export const getRequestFingerprintHash = (
  headers: ApiRequestShape["headers"],
) => createHash("sha256").update(getRequestFingerprint(headers)).digest("hex");
