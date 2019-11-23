import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictChooserComponent } from './district-chooser.component';

describe('DistrictChooserComponent', () => {
  let component: DistrictChooserComponent;
  let fixture: ComponentFixture<DistrictChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistrictChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
