import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AnnouncementGeneralSearchAutocompleteComponent} from './announcement-general-search-autocomplete.component';

describe('AnnouncementGeneralSearchAutocompleteComponent', () => {
  let component: AnnouncementGeneralSearchAutocompleteComponent;
  let fixture: ComponentFixture<AnnouncementGeneralSearchAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnouncementGeneralSearchAutocompleteComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AnnouncementGeneralSearchAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
