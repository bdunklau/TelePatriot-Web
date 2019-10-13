import { TestBed } from '@angular/core/testing';

import { VideoNodeService } from './video-node.service';

describe('VideoNodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VideoNodeService = TestBed.get(VideoNodeService);
    expect(service).toBeTruthy();
  });
});
