export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;


export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
  PUT = 'PUT',
  TRACE = 'TRACE',
}


export interface ModifiedResponses {
  [id: string]: string;
}

export interface ClientHttpResponse {
  statusCode: number;
  statusMessage: string;
  headers: Headers;
  body: any;
}

export interface ClientHttpRequest {
  method?: keyof typeof HttpMethod;
  url?: string;
  headers: Headers;
  body?: any;
  mapped?: boolean;
}

export interface Headers {
  [key: string]: any;
}
