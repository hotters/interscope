import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProxyModule } from './proxy/proxy.module';
import { AppStoreModule } from './store/app-store.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MonacoEditorModule,
    BrowserAnimationsModule,
    AppStoreModule,
    ProxyModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
