import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProxyComponent } from './proxy/proxy.component';

const routes: Routes = [
  {path: '', component: ProxyComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
