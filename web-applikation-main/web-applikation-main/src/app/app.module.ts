import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTableModule} from "@angular/material/table";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {AnnouncementsModule} from "./announcements/announcements.module";
import {AnnouncementsFilterModule} from "./announcements/filter/announcements-filter.module";
import {RoutingModule} from "./routing.module";
import {HashLocationStrategy, LocationStrategy, NgOptimizedImage} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AdvertisementSnackbarComponent} from "./advertisement-snackbar/advertisement-snackbar.component";

@NgModule({
  declarations: [
    AppComponent,
    AdvertisementSnackbarComponent
  ],
  imports: [
    AnnouncementsModule,
    AnnouncementsFilterModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatTooltipModule,
    MatToolbarModule,
    RoutingModule,
    NgOptimizedImage
  ],
  bootstrap: [AppComponent],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}, MatSnackBar]
})
export class AppModule {
}
