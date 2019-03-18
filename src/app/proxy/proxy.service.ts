import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {IncomingMessage, ServerResponse} from 'http';
import {ClientResponse, HttpMethod, HttpProxy} from 'proxy';
import {first, tap} from 'rxjs/operators';
import {AppService} from '../app.service';
import {ElectronService} from '../electron.service';
import {AppState} from '../store/app.state';
import {AddRequest, AddResponse} from './store/proxy.actions';
import {ExchangeState} from './store/proxy.reducer';


@Injectable({
  providedIn: 'root'
})
export class ProxyService {

  proxy: HttpProxy;
  private modifiedResponses: { [id: string]: { headers, body } } = {};

  constructor(
    private appService: AppService,
    private electron: ElectronService,
    private store: Store<AppState>
  ) {
    if (this.electron.isElectron) {
      this.init();
    }
  }

  init() {
    this.proxy = new HttpProxy(
      this.modifyResponse.bind(this),
      this.onResponse.bind(this),
      () => this.appService.showNotification({body: 'Proxy Started Success'}),
      error => console.log(error)
    );
  }

  addModifiedResponse(id, res: { headers, body }) {
    this.modifiedResponses[id] = res;
  }


  private modifyResponse(req: IncomingMessage & { body?: any, method: keyof typeof HttpMethod, id: string }, res: ServerResponse) {
    this.store.dispatch(new AddRequest(req.id, {url: req.url, method: req.method, headers: req.headers, body: req.body}));
    return this.store.pipe(
      first(),
      select(state => state.proxy.exchanges[req.id]),
      tap((exchange: ExchangeState) => {
        if (exchange && exchange.modified) {
          res.writeHead(exchange.modifiedResponse.statusCode, exchange.modifiedResponse.headers);
          res.end(exchange.modifiedResponse.body);
        }
      })
    ).toPromise();
  }

  private onResponse(req, res: ClientResponse) {
    this.store.dispatch(new AddResponse(req.id, res));
  }

}
