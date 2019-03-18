import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MonacoOptions} from '@materia-ui/ngx-monaco-editor';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {AppState} from 'src/app/store/app.state';
import {ProxyService} from '../proxy.service';
import {AddModifiedResponse, UpdateExchange} from '../store/proxy.actions';
import {ExchangeState} from '../store/proxy.reducer';
import {tap} from 'rxjs/operators';


@Component({
  selector: 'request-info',
  templateUrl: './request-info.component.html',
  styleUrls: ['./request-info.component.scss']
})
export class RequestInfoComponent implements OnInit {

  request$: Observable<ExchangeState>;

  editorOptions: MonacoOptions = {
    language: 'json',
    readOnly: false,
    lineNumbers: true,
    minimap: {enabled: false},
    theme: 'vs-light'
  };
  selectedResponse: any;

  constructor(
    private proxyService: ProxyService,
    private store: Store<AppState>,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.request$ = this.store.pipe(
      select(store => store.proxy.exchanges[store.proxy.selected]),
      tap(() => this.cd.detectChanges())
    );
  }

  getObjectLength(obj: Object): number {
    return typeof obj === 'object' ? Object.keys(obj).length : 0;
  }

  onSave(id: string) {
    this.store.dispatch(new AddModifiedResponse(id, this.selectedResponse));
  }

  selectResponse(res) {
    this.selectedResponse = {...res};
  }

  onReset(id: string) {
    this.store.dispatch(new UpdateExchange(id, {modifiedResponse: null, modified: false}));
  }
}
