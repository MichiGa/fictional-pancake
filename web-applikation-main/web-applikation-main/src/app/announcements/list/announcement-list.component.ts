import {Component} from '@angular/core';
import {Announcement} from "../announcements";
import {AnnouncementFilterService} from "../filter/announcement-filter.service";
import {AnnouncementsService} from "../announcements.service";

@Component({
  selector: 'app-announcement-list',
  templateUrl: './announcement-list.component.html',
  styleUrls: ['./announcement-list.component.css']
})
export class AnnouncementListComponent {
  announcementsFiltered: Announcement[] = [];
  announcementsUnfilteredLength = 0;
  isLoadingDataFromWordPress = true;

  constructor(private readonly announcementFilterService: AnnouncementFilterService,
              private readonly announcementsService: AnnouncementsService) {
    announcementFilterService.filteredAnnouncements$.subscribe(announcements => this.announcementsFiltered = announcements);

    announcementsService.announcements$.subscribe(announcements => this.announcementsUnfilteredLength = announcements.length);

    announcementsService.isLoadingDataFromMashup$.subscribe(isLoadingDataFromWordPress =>
      this.isLoadingDataFromWordPress = isLoadingDataFromWordPress);
  }
}
