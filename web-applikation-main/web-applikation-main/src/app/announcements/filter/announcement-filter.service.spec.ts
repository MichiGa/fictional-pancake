import {TestBed} from '@angular/core/testing';

import {AnnouncementFilterService} from './announcement-filter.service';

describe('AnnouncementFilterService', () => {
  let service: AnnouncementFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnouncementFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
