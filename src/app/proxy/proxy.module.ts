import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { ProxyComponent } from './proxy.component';
import { RequestInfoComponent } from './request-info/request-info.component';
import { ProxyEffects } from './store/proxy.effects';
import { reducer } from './store/proxy.reducer';
import { RequestItemComponent } from './request-list/request-item/request-item.component';
import { RequestListComponent } from './request-list/request-list.component';
import { RequestInfoFieldComponent } from './request-info/request-info-field/request-info-field.component';
import { RequestInfoHeadersComponent } from './request-info/request-info-headers/request-info-headers.component';
import { RequestMapComponent } from './request-map/request-map.component';


@NgModule({
  declarations: [
    ProxyComponent,
    RequestInfoComponent,
    RequestInfoFieldComponent,
    RequestItemComponent,
    RequestListComponent,
    RequestInfoHeadersComponent,
    RequestMapComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    EffectsModule.forFeature([ProxyEffects]),
    StoreModule.forFeature('proxy', reducer)
  ],
  entryComponents: [
    RequestMapComponent
  ]
})
export class ProxyModule {
}
