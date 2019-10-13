import { TestBed, async, inject } from '@angular/core/testing';

import { VideoInvitationGuard } from './video-invitation.guard';

describe('VideoInvitationGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VideoInvitationGuard]
    });
  });

  it('should ...', inject([VideoInvitationGuard], (guard: VideoInvitationGuard) => {
    expect(guard).toBeTruthy();
  }));
});
