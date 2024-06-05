import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {
  AnnouncementDetailsEntryComponent
} from "./announcements/announcement/details/details-entry/announcement-details-entry.component";

const routes: Routes = [
  {
    path: ':id',
    component: AnnouncementDetailsEntryComponent
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule {
}
