import { TestBed } from '@angular/core/testing';

import { VideoTokenService } from './video-token.service';

describe('VideoTokenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VideoTokenService = TestBed.get(VideoTokenService);
    expect(service).toBeTruthy();
  });
});
