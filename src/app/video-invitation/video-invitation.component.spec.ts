import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoInvitationComponent } from './video-invitation.component';

describe('VideoInvitationComponent', () => {
  let component: VideoInvitationComponent;
  let fixture: ComponentFixture<VideoInvitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoInvitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
