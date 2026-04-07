import { basename, sep } from "node:path";
import { fileURLToPath } from "node:url";
import type { ApiEventName } from "./events";

const serializeError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }

  return {
    message: "Unknown error",
  };
};

export const getLogSource = (moduleUrl: string) =>
  (() => {
    const filePath = fileURLToPath(moduleUrl);
    const normalizedPath = filePath.split(sep).join("/");
    const apiSegment = "/api/";

    const apiIndex = normalizedPath.lastIndexOf(apiSegment);

    if (apiIndex >= 0) {
      return normalizedPath.slice(apiIndex + 1);
    }

    return basename(filePath);
  })();

export const logInfo = (
  source: string,
  event: ApiEventName,
  metadata: Record<string, unknown> = {},
) => {
  console.info({
    scope: "api",
    source,
    event,
    ...metadata,
  });
};

export const logError = (
  source: string,
  event: ApiEventName,
  error: unknown,
  metadata: Record<string, unknown> = {},
) => {
  console.error({
    scope: "api",
    source,
    event,
    ...metadata,
    error: serializeError(error),
  });
};
