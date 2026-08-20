export interface ApiRequestShape<TBody = unknown> {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: TBody;
  query?: Record<string, string | string[] | undefined>;
  url?: string;
}

export interface ApiResponseShape {
  status: (code: number) => ApiResponseShape;
  setHeader: (name: string, value: string) => ApiResponseShape;
  send: (body: string) => void;
}
