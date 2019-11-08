import { TestBed, async, inject } from '@angular/core/testing';

import { MissionAccomplishedGuard } from './mission-accomplished.guard';

describe('MissionAccomplishedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MissionAccomplishedGuard]
    });
  });

  it('should ...', inject([MissionAccomplishedGuard], (guard: MissionAccomplishedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
