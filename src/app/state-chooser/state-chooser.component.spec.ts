import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateChooserComponent } from './state-chooser.component';

describe('StateChooserComponent', () => {
  let component: StateChooserComponent;
  let fixture: ComponentFixture<StateChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
