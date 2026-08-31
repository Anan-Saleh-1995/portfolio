import { getLocaleDirection, type Direction, type Locale } from "./config";

export const inputKinds = Object.freeze([
  "text",
  "email",
  "password",
  "code",
  "phone",
  "number",
  "url",
] as const);

export type InputKind = (typeof inputKinds)[number];
export type InputDirection = "auto" | "ltr";

const technicalInputKinds = new Set<InputKind>([
  "email",
  "password",
  "code",
  "phone",
  "number",
  "url",
]);

export const getInputDirection = (inputKind: InputKind): InputDirection =>
  technicalInputKinds.has(inputKind) ? "ltr" : "auto";

type DocumentLocaleRoot = Pick<HTMLElement, "dir" | "lang">;

export const applyDocumentLocale = (
  locale: Locale,
  root: DocumentLocaleRoot = document.documentElement,
): Direction => {
  const direction = getLocaleDirection(locale);

  root.lang = locale;
  root.dir = direction;

  return direction;
};
