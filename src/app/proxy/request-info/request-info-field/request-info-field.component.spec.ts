import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestInfoFieldComponent } from './request-info-field.component';

describe('RequestInfoFieldComponent', () => {
  let component: RequestInfoFieldComponent;
  let fixture: ComponentFixture<RequestInfoFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [RequestInfoFieldComponent]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestInfoFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
