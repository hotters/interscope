import {NgModule} from '@angular/core';
import {MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatRippleModule, MatTableModule} from '@angular/material';
import {MonacoEditorModule} from '@materia-ui/ngx-monaco-editor';

const Shared = [
  MonacoEditorModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatRippleModule,
  MatButtonModule,
  MatIconModule
];

@NgModule({
  declarations: [],
  imports: Shared,
  exports: Shared
})
export class SharedModule {
}
