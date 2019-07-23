import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-request-info-headers',
  templateUrl: './request-info-headers.component.html',
  styleUrls: ['./request-info-headers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestInfoHeadersComponent implements OnInit, OnChanges {

  @Input() headers;
  private headersForm: FormGroup;


  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.headers) {
      this.createHeadersForm();
    }
  }

  private createHeadersForm() {
    this.headersForm = this.fb.group({});
    Object.entries(this.headers).forEach(([key, value]) => {
      this.headersForm.addControl(key, new FormControl(value));
    });
  }

}
