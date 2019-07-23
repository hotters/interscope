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
import { SearchPipe } from './search-pipe/search.pipe';
import { SpinnerComponent } from './spinner/spinner.component';

const Declarations = [
  SearchPipe,
  SpinnerComponent
];

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
  declarations: Declarations,
  imports: Shared,
  exports: [...Shared, ...Declarations]
})
export class SharedModule {
}
