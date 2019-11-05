import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickStart2Component } from './quick-start2.component';

describe('QuickStart2Component', () => {
  let component: QuickStart2Component;
  let fixture: ComponentFixture<QuickStart2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickStart2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickStart2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
