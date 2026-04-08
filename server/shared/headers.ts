export const getHeaderValue = (
  value: string | string[] | undefined,
): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

export const getRequestFingerprint = (
  headers: Record<string, string | string[] | undefined>,
) =>
  getHeaderValue(headers["x-forwarded-for"]) ??
  getHeaderValue(headers["x-real-ip"]) ??
  getHeaderValue(headers.origin) ??
  "unknown";
