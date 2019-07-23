import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { ProxyComponent } from './proxy.component';
import { RequestInfoComponent } from './request-info/request-info.component';
import { RequestListComponent } from './request-list/request-list.component';
import { ProxyEffects } from './store/proxy.effects';
import { reducer } from './store/proxy.reducer';
import { RequestItemComponent } from './request-item/request-item.component';


@NgModule({
  declarations: [
    ProxyComponent,
    RequestListComponent,
    RequestInfoComponent,
    RequestItemComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EffectsModule.forFeature([ProxyEffects]),
    StoreModule.forFeature('proxy', reducer)
  ]
})
export class ProxyModule {
}
