import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ProxyService } from '../proxy.service';
import { ClearRequests, SelectExchange } from '../store/proxy.actions';
import { AppState } from 'src/app/store/app.state';
import { map } from 'rxjs/operators';

@Component({
  selector: 'request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestListComponent implements OnInit, OnDestroy {

  requests$;
  selectedId;

  constructor(
    private proxyService: ProxyService,
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    this.requests$ = this.store.pipe(
      select(store => store.proxy.exchanges),
      map(i => Object.values(i).map(({ id, pending, modified, method, url }) => ({ id, pending, modified, method, url })))
    );
  }

  trackByFn(index, item) {
    return item.id;
  }


  clear() {
    this.store.dispatch(new ClearRequests());
  }

  ngOnDestroy(): void {

  }

  addMapping() {

  }

  onSelect(id: string) {
    this.selectedId = id !== this.selectedId ? id : null;
    this.store.dispatch(new SelectExchange(this.selectedId));
  }
}
