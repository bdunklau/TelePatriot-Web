import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaDisplayComponent } from './social-media-display.component';

describe('SocialMediaDisplayComponent', () => {
  let component: SocialMediaDisplayComponent;
  let fixture: ComponentFixture<SocialMediaDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialMediaDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialMediaDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
