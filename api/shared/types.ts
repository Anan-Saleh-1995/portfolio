import type { HttpMethod } from "./http";

export interface ApiRequestShape<TBody = unknown> {
  method?: HttpMethod;
  headers: Record<string, string | string[] | undefined>;
  body?: TBody;
}

export interface ApiResponseShape {
  status: (code: number) => ApiResponseShape;
  setHeader: (name: string, value: string) => ApiResponseShape;
  send: (body: string) => void;
}
