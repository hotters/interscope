import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {ProxyService} from '../proxy.service';
import {SelectExchange, UpdateExchange} from '../store/proxy.actions';
import {ExchangeState} from '../store/proxy.reducer';
import {AppState} from 'src/app/store/app.state';
import {HttpMethod} from 'proxy/models';
import {map} from 'rxjs/operators';

@Component({
  selector: 'request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class RequestListComponent implements OnInit {

  requests: any = [];
  requests$: Observable<{ [id: number]: ExchangeState }>;
  selectedId: string | null = null;

  constructor(
    private proxyService: ProxyService,
    private store: Store<AppState>,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.requests$ = this.store.pipe(
      select(store => store.proxy.exchanges),
      map(i => Object.values(i)),
    );

    this.requests$.subscribe((i: any) => {
      this.requests = i;
      console.log(this.requests);
      this.cd.detectChanges();
    });
  }

  onSelect(id: string) {
    this.selectedId = id !== this.selectedId ? id : null;
    this.store.dispatch(new SelectExchange(this.selectedId));
    this.cd.detectChanges();
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
    return item.key;
  }

  removeModified(id) {
    this.store.dispatch(new UpdateExchange(id, {modifiedResponse: null, modified: false}));
  }

  onCLick() {
    this.requests.push({id: 123});
  }
}
