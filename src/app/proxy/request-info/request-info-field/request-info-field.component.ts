import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-request-info-field',
  templateUrl: './request-info-field.component.html',
  styleUrls: ['./request-info-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RequestInfoFieldComponent),
    multi: true
  }]
})
export class RequestInfoFieldComponent implements OnInit, ControlValueAccessor {

  @Input() formControl: FormControl;

  constructor() {
  }

  ngOnInit() {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
  }

}
