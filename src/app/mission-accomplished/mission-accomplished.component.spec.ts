import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionAccomplishedComponent } from './mission-accomplished.component';

describe('MissionAccomplishedComponent', () => {
  let component: MissionAccomplishedComponent;
  let fixture: ComponentFixture<MissionAccomplishedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionAccomplishedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionAccomplishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
