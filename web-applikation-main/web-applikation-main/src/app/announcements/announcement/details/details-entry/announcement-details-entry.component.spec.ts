import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AnnouncementDetailsEntryComponent} from './announcement-details-entry.component';

describe('DetailsEntryComponent', () => {
  let component: AnnouncementDetailsEntryComponent;
  let fixture: ComponentFixture<AnnouncementDetailsEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnouncementDetailsEntryComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AnnouncementDetailsEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
