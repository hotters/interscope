import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestInfoHeadersComponent } from './request-info-headers.component';

describe('RequestInfoHeadersComponent', () => {
  let component: RequestInfoHeadersComponent;
  let fixture: ComponentFixture<RequestInfoHeadersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [RequestInfoHeadersComponent]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestInfoHeadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
