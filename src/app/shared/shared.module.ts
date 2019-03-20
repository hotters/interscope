import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatTableModule
} from '@angular/material';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const Shared = [
  FormsModule,
  ReactiveFormsModule,
  MonacoEditorModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatRippleModule,
  MatButtonModule,
  MatInputModule,
  MatIconModule,
  MatButtonToggleModule
];

@NgModule({
  declarations: [],
  imports: Shared,
  exports: Shared
})
export class SharedModule {
}
