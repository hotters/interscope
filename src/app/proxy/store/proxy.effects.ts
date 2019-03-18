import {Injectable} from '@angular/core';
import {Actions} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {AppState} from 'src/app/store/app.state';
import {ProxyService} from '../proxy.service';


@Injectable()
export class ProxyEffects {

  // @Effect()
  // sendResponse$ = this.actions$.pipe(
  //   ofType(ProxyActionTypes.AddResponse),
  //   switchMap((action: AddResponse) => {
  //     this.proxyService.sendResponse(action.id, action.response.body);
  //     return of(action);
  //   }),
  //   map(action => new UpdateExchange(action.id, { pending: false }))

  // );

  constructor(
    private proxyService: ProxyService,
    private actions$: Actions,
    private store: Store<AppState>
  ) {
  }
}
