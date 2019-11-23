import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteParticipantComponent } from './remote-participant.component';

describe('RemoteParticipantComponent', () => {
  let component: RemoteParticipantComponent;
  let fixture: ComponentFixture<RemoteParticipantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoteParticipantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
