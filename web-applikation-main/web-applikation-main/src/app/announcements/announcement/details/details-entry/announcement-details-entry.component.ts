import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AnnouncementDetailsComponent} from "../announcement-details.component";
import {filter, fromEvent} from "rxjs";
import {AnnouncementsService} from "../../../announcements.service";
import {Announcement} from "../../../announcements";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-details-entry',
  templateUrl: './announcement-details-entry.component.html',
  styleUrls: ['./announcement-details-entry.component.css']
})
export class AnnouncementDetailsEntryComponent {
  private announcementId!: number;
  private announcement!: Announcement;
  private announcements: Announcement[] = [];

  constructor(public dialog: MatDialog,
              private readonly announcementsService: AnnouncementsService,
              private readonly router: Router,
              private readonly route: ActivatedRoute) {

    this.announcementsService.announcements$.pipe(filter(announcements => announcements.length > 0))
      .subscribe(announcements => {
        this.announcements = announcements;

        if (this.announcementId) {
          this.getAnnouncementById();
          this.openDetailsComponent();
        }
      });

    this.route.paramMap.subscribe(queryParamMap => {
      if (queryParamMap.has('id')) {
        this.announcementId = parseInt(<string>queryParamMap.get('id'));

        if (this.announcements.length > 0) {
          this.getAnnouncementById();
          this.openDetailsComponent();
        }
      }
    })
  }

  openDetailsComponent() {
    const dialogRef = this.dialog.open(AnnouncementDetailsComponent, {
      enterAnimationDuration: 0,
      exitAnimationDuration: 0,
      width: this.getDetailsComponentWidth(),
      maxWidth: '100vw',
      backdropClass: 'announcement_details_backdrop'
    });
    dialogRef.componentInstance.announcement = this.announcement;

    const windowResizeSubscription = fromEvent(window, 'resize').subscribe(() => dialogRef.updateSize(this.getDetailsComponentWidth()));
    dialogRef.afterClosed().subscribe(() => {
      windowResizeSubscription.unsubscribe();
      this.router.navigate([''], {queryParamsHandling: "preserve"});
    });
  }

  private getAnnouncementById() {
    const index = this.announcements.findIndex(a => a.id === this.announcementId);
    if (index >= 0)
      this.announcement = this.announcements[index];
  }

  private getDetailsComponentWidth() {
    const windowInnerWidth = window.innerWidth;
    let componentWidth: string;

    if (windowInnerWidth < 800)
      componentWidth = '85vw';
    else if (windowInnerWidth < 1400)
      componentWidth = '70vw';
    else if (windowInnerWidth < 2000)
      componentWidth = '60vw';
    else
      componentWidth = '50vw';

    return componentWidth;
  }
}
