import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MonacoOptions } from '@materia-ui/ngx-monaco-editor';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import { ProxyService } from '../proxy.service';
import { AddModifiedResponse } from '../store/proxy.actions';
import { ExchangeState } from '../store/proxy.reducer';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'request-info',
  templateUrl: './request-info.component.html',
  styleUrls: ['./request-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class RequestInfoComponent implements OnInit {

  request$: Observable<ExchangeState>;

  firstChange = true;

  editorOptions: MonacoOptions = {
    language: 'json',
    readOnly: false,
    lineNumbers: true,
    minimap: { enabled: false },
    theme: 'vs-light'
  };
  selectedResponse: any;

  constructor(
    private proxyService: ProxyService,
    private store: Store<AppState>
  ) {
  }

  ngOnInit() {
    this.request$ = this.store.pipe(
      select(store => store.proxy.exchanges[store.proxy.selected]),
      tap(() => this.firstChange = true)
    );
  }

  getObjectLength(obj: Object): number {
    return typeof obj === 'object' ? Object.keys(obj).length : 0;
  }

  onCodeChange(str, id: string) {
    if (!this.firstChange) {
      this.store.dispatch(new AddModifiedResponse(id, this.selectedResponse));
    } else {
      this.firstChange = false;
    }
  }
}
