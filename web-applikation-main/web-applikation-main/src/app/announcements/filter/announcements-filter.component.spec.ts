import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AnnouncementsFilterComponent} from './announcements-filter.component';

describe('AnnouncementsFilterComponent', () => {
  let component: AnnouncementsFilterComponent;
  let fixture: ComponentFixture<AnnouncementsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnouncementsFilterComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AnnouncementsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
