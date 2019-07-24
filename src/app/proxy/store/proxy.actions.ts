import { Action } from '@ngrx/store';
import { ExchangeState } from './proxy.reducer';
import { ProxyHttpRequest, ProxyHttpResponse } from 'proxy';


export enum ProxyActionTypes {
  AddRequest = '[Proxy] AddRequest',
  AddResponse = '[Proxy] AddResponse',
  AddModifiedResponse = '[Proxy] AddModifiedResponse',
  UpdateExchange = '[Proxy] UpdateExchange',
  SelectExchange = '[Proxy] SelectExchange',
  ClearRequests = '[Proxy] ClearRequests',
  ResetModifiedRequest = '[Proxy] ResetModifiedRequest',
  InitRequests = '[Proxy] InitRequests'
}


export class AddRequest implements Action {
  readonly type = ProxyActionTypes.AddRequest;

  constructor(public id: string, public payload: ProxyHttpRequest) {
  }
}

export class AddResponse implements Action {
  readonly type = ProxyActionTypes.AddResponse;

  constructor(public id: string, public payload: ProxyHttpResponse) {
  }
}

export class AddModifiedResponse implements Action {
  readonly type = ProxyActionTypes.AddModifiedResponse;

  constructor(public id: string, public payload: ProxyHttpResponse) {
  }
}

export class UpdateExchange implements Action {
  readonly type = ProxyActionTypes.UpdateExchange;

  constructor(public id: string, public payload: Partial<ExchangeState>) {
  }
}

export class ResetModifiedRequest implements Action {
  readonly type = ProxyActionTypes.ResetModifiedRequest;

  constructor(public id: string) {
  }
}

export class SelectExchange implements Action {
  readonly type = ProxyActionTypes.SelectExchange;

  constructor(public id: string) {
  }
}

export class ClearRequests implements Action {
  readonly type = ProxyActionTypes.ClearRequests;
}

export class InitRequests implements Action {
  readonly type = ProxyActionTypes.InitRequests;

  constructor(public payload: any) {
  }
}


export type ProxyActions
  = AddRequest
  | UpdateExchange
  | AddResponse
  | SelectExchange
  | AddModifiedResponse
  | ResetModifiedRequest
  | ClearRequests
  | InitRequests;

