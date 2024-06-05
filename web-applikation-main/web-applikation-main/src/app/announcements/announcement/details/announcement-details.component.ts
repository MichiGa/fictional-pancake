import {Component} from '@angular/core';
import {Announcement} from "../../announcements";

@Component({
  selector: 'app-announcement-details',
  templateUrl: './announcement-details.component.html',
  styleUrls: ['./announcement-details.component.css'],
})
export class AnnouncementDetailsComponent {
  announcement!: Announcement;

  getAnnouncementStateBackgroundColor() {
    if (this.announcement) {
      switch (this.announcement.state) {
        case 'Verfügbar':
          return '#08C51C';
        case 'In Bearbeitung':
          return '#ED6600';
        case 'Abgeschlossen':
          return '#808080';
      }
    }
    return 'white';
  }

  protected readonly window = window;
}
