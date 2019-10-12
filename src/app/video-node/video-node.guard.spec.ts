import { TestBed, async, inject } from '@angular/core/testing';

import { VideoNodeGuard } from './video-node.guard';

describe('VideoNodeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VideoNodeGuard]
    });
  });

  it('should ...', inject([VideoNodeGuard], (guard: VideoNodeGuard) => {
    expect(guard).toBeTruthy();
  }));
});
