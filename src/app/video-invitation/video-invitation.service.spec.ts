import { TestBed } from '@angular/core/testing';

import { VideoInvitationService } from './video-invitation.service';

describe('VideoInvitationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VideoInvitationService = TestBed.get(VideoInvitationService);
    expect(service).toBeTruthy();
  });
});
