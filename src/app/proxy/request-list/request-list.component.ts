import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ProxyService } from '../proxy.service';
import { ClearRequests, ResetModifiedRequest, SelectExchange } from '../store/proxy.actions';
import { AppState } from 'src/app/store/app.state';
import { HttpMethod } from 'proxy';
import { map } from 'rxjs/operators';

@Component({
  selector: 'request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
})
export class RequestListComponent implements OnInit, OnDestroy {

  urlStr = '';
  requests = [];
  requests$: Subscription;
  selectedId: string | null = null;

  constructor(
    private proxyService: ProxyService,
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    this.requests$ = this.store.pipe(
      select(store => store.proxy.exchanges),
      map(i => Object.values(i).map(({ id, pending, modified, method, url }) => ({ id, pending, modified, method, url })))
    ).subscribe(i => this.requests = i);
  }

  onSelect(id: string) {
    this.selectedId = id !== this.selectedId ? id : null;
    this.store.dispatch(new SelectExchange(this.selectedId));
  }

  getMethodColor(method: HttpMethod): string {
    switch (method) {
      case HttpMethod.GET:
        return '#e7f0f7';

      case HttpMethod.DELETE:
        return '#f5e8e8';

      case HttpMethod.POST:
        return '#e7f6ec';

      case HttpMethod.HEAD:
        return '##fcffcd';

      case HttpMethod.OPTIONS:
        return '#e7f0f7';

      case HttpMethod.PUT:
        return '#f9f2e9';

      case HttpMethod.PATCH:
        return '#fce9e3';

      default:
        return '#fff';
    }
  }

  trackByFn(index, item) {
    return item.id;
  }

  reset(e, id) {
    e.stopPropagation();
    this.store.dispatch(new ResetModifiedRequest(id));
  }

  clear() {
    this.store.dispatch(new ClearRequests());
  }

  ngOnDestroy(): void {
    this.requests$.unsubscribe();
  }

  addMapping() {

  }
}
