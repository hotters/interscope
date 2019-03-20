import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MonacoOptions } from '@materia-ui/ngx-monaco-editor';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import { ProxyService } from '../proxy.service';
import { AddModifiedResponse } from '../store/proxy.actions';
import { ExchangeState } from '../store/proxy.reducer';
import { debounceTime, tap } from 'rxjs/operators';
import { ClientHttpResponse } from 'proxy';


@Component({
  selector: 'request-info',
  templateUrl: './request-info.component.html',
  styleUrls: ['./request-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class RequestInfoComponent implements OnInit, OnDestroy {

  request$: Observable<ExchangeState>;
  codeChanged$ = new Subject<[string, ClientHttpResponse]>();
  isInitChange = true;
  body = '';

  editorOptions: MonacoOptions = {
    language: 'json',
    readOnly: false,
    lineNumbers: true,
    minimap: { enabled: false },
    theme: 'vs-light'
  };

  constructor(
    private proxyService: ProxyService,
    private store: Store<AppState>
  ) {
  }

  ngOnInit() {

    this.request$ = this.store.pipe(
      select(store => store.proxy.exchanges[store.proxy.selected]),
      tap(v => {
        if (v && v.response) {
          this.body = v.modifiedResponse.body;
        }
      }),
      tap(() => this.isInitChange = true)
    );
    this.codeChanged$.pipe(
      debounceTime(400)
    ).subscribe(value => {
      this.store.dispatch(new AddModifiedResponse(value[0], value[1]));
    });
  }

  getObjectLength(obj: Object): number {
    return typeof obj === 'object' ? Object.keys(obj).length : 0;
  }

  onCodeChange(body: string, request: ExchangeState) {
    this.body = body;
    if (!this.isInitChange) {
      this.codeChanged$.next([request.id, { ...request.response, body }]);
    }
    this.isInitChange = false;
  }

  setLang(name) {
    this.editorOptions = { ...this.editorOptions, language: name };
  }

  ngOnDestroy() {
    this.codeChanged$.unsubscribe();
  }

  private chooseLang(req: ExchangeState) {
    switch (req.response.headers['content-type']) {
      case 'text/html':
        return 'html';
      case 'text/css':
        return 'css';
      case 'application/json':
        return 'json';
      case 'application/javascript':
        return 'javascript';
      default:
        return 'text';
    }
  }
}
