import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCreatorsComponent } from './video-creators.component';

describe('VideoCreatorsComponent', () => {
  let component: VideoCreatorsComponent;
  let fixture: ComponentFixture<VideoCreatorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoCreatorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoCreatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
