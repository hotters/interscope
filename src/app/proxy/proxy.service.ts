import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ClientRequest, IncomingMessage, ServerResponse } from 'http';
import { ClientHttpResponse, HttpMethod, HttpProxy } from 'proxy';
import { first, tap } from 'rxjs/operators';
import { AppService } from '../app.service';
import { AppState } from '../store/app.state';
import { AddRequest, AddResponse } from './store/proxy.actions';
import { ExchangeState } from './store/proxy.reducer';


@Injectable({
  providedIn: 'root'
})
export class ProxyService {

  proxy: HttpProxy;
  private modifiedResponses: { [id: string]: { headers, body } } = {};

  constructor(
    private appService: AppService,
    private store: Store<AppState>
  ) {
  }

  init() {
    this.proxy = new HttpProxy(
      this.transform.bind(this),
      this.onResponse.bind(this),
      () => this.appService.showNotification({ body: 'Proxy Started Success' }),
      error => console.log(error)
    );
  }

  addModifiedResponse(id, res: { headers, body }) {
    this.modifiedResponses[id] = res;
  }

  private transform(proxyReq: ClientRequest, req: IncomingMessage & { body?: any, id: string }, res: ServerResponse) {
    this.store.dispatch(new AddRequest(req.id, {
      url: req.url,
      method: <keyof typeof HttpMethod>req.method,
      headers: req.headers,
      body: req.body
    }));
    return this.store.pipe(
      first(),
      select(state => state.proxy.exchanges[req.id]),
      tap((exchange: ExchangeState) => {
        if (exchange && exchange.modified) {
          delete exchange.modifiedResponse.headers['content-length'];
          proxyReq.abort();
          res.writeHead(exchange.modifiedResponse.statusCode, exchange.modifiedResponse.headers);
          res.end(exchange.modifiedResponse.body);
        }
      })
    ).toPromise();
  }

  private onResponse(req, res: ClientHttpResponse) {
    this.store.dispatch(new AddResponse(req.id, res));
  }

}
