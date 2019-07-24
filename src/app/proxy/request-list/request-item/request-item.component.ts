import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResetModifiedRequest } from '../../store/proxy.actions';
import { HttpMethod } from 'proxy/src/models';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';

@Component({
  selector: 'app-request-item',
  templateUrl: './request-item.component.html',
  styleUrls: ['./request-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestItemComponent implements OnInit {

  @Input() request;
  @Input() selected = false;
  @Output() onSelect = new EventEmitter<string>();

  constructor(
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {
  }

  reset(e, id) {
    e.stopPropagation();
    this.store.dispatch(new ResetModifiedRequest(id));
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

}
