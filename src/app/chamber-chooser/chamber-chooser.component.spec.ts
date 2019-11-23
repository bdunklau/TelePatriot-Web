import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChamberChooserComponent } from './chamber-chooser.component';

describe('ChamberChooserComponent', () => {
  let component: ChamberChooserComponent;
  let fixture: ComponentFixture<ChamberChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChamberChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChamberChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
