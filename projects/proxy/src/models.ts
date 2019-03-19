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
  headers: { [key: string]: any };
  body: any;
}

export interface ClientHttpRequest {
  method?: keyof typeof HttpMethod;
  url?: string;
  headers: { [key: string]: any };
  body?: any;
}

