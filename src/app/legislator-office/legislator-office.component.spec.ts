import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegislatorOfficeComponent } from './legislator-office.component';

describe('LegislatorOfficeComponent', () => {
  let component: LegislatorOfficeComponent;
  let fixture: ComponentFixture<LegislatorOfficeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegislatorOfficeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegislatorOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
