import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSection } from './about-section';

describe('AboutSection', () => {
  let component: AboutSection;
  let fixture: ComponentFixture<AboutSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
