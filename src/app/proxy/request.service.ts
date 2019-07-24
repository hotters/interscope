import { Injectable } from '@angular/core';
import { ExchangeState } from './store/proxy.reducer';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  selected: string;

  constructor() {
  }

  private _exchange = new Map<string, ExchangeState>();

  get exchange() {
    return Array.from(this._exchange);
  }

  get(id: string) {
    return this._exchange.get(id);
  }

  set(id: string, exchange) {
    this._exchange.set(id, exchange);
  }

  setExchange(id: string, exchange) {
    this._exchange.set(id, { ...this._exchange.get(id), ...exchange });
  }


}
