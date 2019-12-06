import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { AppComponent } from './app.component';
import { ProxyModule } from './proxy/proxy.module';
import { AppStoreModule } from './store/app-store.module';
import { RouterModule } from '@angular/router';
import { RequestComponent } from './request/request.component';


@NgModule({
  declarations: [
    AppComponent,
    RequestComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([{path: '', component: RequestComponent}]),
    // MonacoEditorModule,
    BrowserAnimationsModule,
    AppStoreModule,
    // ProxyModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
