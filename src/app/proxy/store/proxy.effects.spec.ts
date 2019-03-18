import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Observable} from 'rxjs';

import {ProxyEffects} from './proxy.effects';

describe('ProxyEffects', () => {
  let actions$: Observable<any>;
  let effects: ProxyEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProxyEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(ProxyEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
