export const isString = (value: unknown): value is string =>
  typeof value === "string";

const getTrimmedString = (value: unknown) =>
  isString(value) ? value.trim() : "";

export const getEnvString = (value: string | undefined) =>
  getTrimmedString(value);
