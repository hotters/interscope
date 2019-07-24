import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ClientRequest, IncomingMessage } from 'http';
import { HttpMethod, HttpProxy, ProxyHttpResponse } from 'proxy';
import { first, map } from 'rxjs/operators';
import { AppService } from '../app.service';
import { AppState } from '../store/app.state';
import { AddRequest, AddResponse, InitRequests } from './store/proxy.actions';
import { ExchangeState } from './store/proxy.reducer';
import { MOCK } from '../../assets/js/mock';
import { RequestService } from './request.service';


@Injectable({
  providedIn: 'root'
})
export class ProxyService {

  proxy: HttpProxy;
  private isMock = false;

  constructor(
    private appService: AppService,
    private requestService: RequestService,
    private store: Store<AppState>
  ) {
  }

  init() {
    this.proxy = new HttpProxy(
      this.onRequest.bind(this),
      this.onResponse.bind(this),
      () => this.appService.showNotification({ body: 'Proxy Started Success' }),
      error => console.log(error)
    );
  }

  mock() {
    if (!this.isMock) {
      this.isMock = true;
      this.store.dispatch(new InitRequests(MOCK));
    }
  }

  private onRequest(req: IncomingMessage & { body?: any, id: string, mapped?: boolean }): Promise<{ statusCode, headers, body } | null> {
    this.store.dispatch(new AddRequest(req.id, {
      url: req.url,
      method: <HttpMethod>req.method,
      headers: req.headers,
      body: req.body,
      mapped: req.mapped
    }));
    return this.store.pipe(
      first(),
      select(state => state.proxy.exchanges[req.id]),
      map((exchange: ExchangeState) => {
        if (exchange && exchange.modified) {
          delete exchange.modifiedResponse.headers['content-length'];
          return exchange.modifiedResponse;
        }
        return null;
      })
    ).toPromise();
  }

  private onResponse(req, res: ProxyHttpResponse) {
    this.store.dispatch(new AddResponse(req.id, res));
  }

  private deleteRequestCacheHeaders(req: ClientRequest) {
    req.removeHeader('etag');
    req.removeHeader('if-none-match');
    req.removeHeader('if-modified-since');
    req.removeHeader('last-modified');
    req.setHeader('expires', '0');
    req.setHeader('cache-control', 'no-cache');
    req.setHeader('pragma', 'no-cache');
  }

}
