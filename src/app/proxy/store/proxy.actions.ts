import { Action } from '@ngrx/store';
import { ExchangeState } from './proxy.reducer';
import { ClientHttpRequest, ClientHttpResponse } from 'proxy';


export enum ProxyActionTypes {
  AddRequest = '[Proxy] AddRequest',
  AddResponse = '[Proxy] AddResponse',
  AddModifiedResponse = '[Proxy] AddModifiedResponse',
  UpdateExchange = '[Proxy] UpdateExchange',
  SelectExchange = '[Proxy] SelectExchange',
  ClearRequests = '[Proxy] ClearRequests'
}


export class AddRequest implements Action {
  readonly type = ProxyActionTypes.AddRequest;

  constructor(public id: string, public payload: ClientHttpRequest) {
  }
}

export class AddResponse implements Action {
  readonly type = ProxyActionTypes.AddResponse;

  constructor(public id: string, public payload: ClientHttpResponse) {
  }
}

export class AddModifiedResponse implements Action {
  readonly type = ProxyActionTypes.AddModifiedResponse;

  constructor(public id: string, public payload: ClientHttpResponse) {
  }
}

export class UpdateExchange implements Action {
  readonly type = ProxyActionTypes.UpdateExchange;

  constructor(public id: string, public payload: Partial<ExchangeState>) {
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


export type ProxyActions
  = AddRequest
  | UpdateExchange
  | AddResponse
  | SelectExchange
  | AddModifiedResponse
  | ClearRequests;

