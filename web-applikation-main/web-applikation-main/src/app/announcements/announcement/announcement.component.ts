import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Announcement} from "../announcements";
import {Router} from "@angular/router";

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent {
  @Input() announcement!: Announcement;
  @ViewChild('announcementTypes', {read: ElementRef, static: false}) announcementTypes?: ElementRef;
  @ViewChild('announcementInstitutes') announcementInstitutes?: ElementRef;

  constructor(private readonly router: Router) {
  }

  navigateToDetailsComponent() {
    this.router.navigate([this.announcement.id], {queryParamsHandling: "preserve"});
  }

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

  getAnnouncementDescriptionTruncated(): string {
    const announcementTypesHeight = this.announcementTypes?.nativeElement.offsetHeight;
    const announcementInstitutesHeight = this.announcementInstitutes?.nativeElement.offsetHeight;

    if (announcementTypesHeight && announcementInstitutesHeight) {
      const remainingSpace = 200 - announcementTypesHeight - announcementInstitutesHeight;
      let sliceIndex = Math.floor(remainingSpace * this.announcementDetailsTruncationFactor());

      if (sliceIndex < this.announcement.description.length) {
        let left = sliceIndex - 1;
        let right = sliceIndex;

        while (left >= 0 && right < this.announcement.description.length) {
          if (this.announcement.description.charAt(left) === ' ') {
            sliceIndex = left;
            break;
          }
          else if (this.announcement.description.charAt(right) === ' ') {
            sliceIndex = right;
            break;
          }

          left--;
          right++;
        }
      }

      return this.announcement.description.slice(0, sliceIndex) + ' ...';
    }

    return '';
  }

  private announcementDetailsTruncationFactor(): number {
    const width = window.innerWidth;
    if (width < 768)
      return 2.2;
    else if (width < 992)
      return 2;
    else
      return 1.8;
  }

}
