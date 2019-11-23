import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegislatorChooserComponent } from './legislator-chooser.component';

describe('LegislatorChooserComponent', () => {
  let component: LegislatorChooserComponent;
  let fixture: ComponentFixture<LegislatorChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegislatorChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegislatorChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
