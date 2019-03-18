import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProxyComponent} from './proxy/proxy.component';

const routes: Routes = [
  {path: 'proxy', component: ProxyComponent},
  {path: '', redirectTo: '/proxy', pathMatch: 'full'},
  {path: '**', redirectTo: '/proxy', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
