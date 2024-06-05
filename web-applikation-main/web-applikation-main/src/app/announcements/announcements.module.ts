import {NgModule} from '@angular/core';
import {AsyncPipe, CommonModule, NgOptimizedImage} from '@angular/common';
import {AnnouncementListComponent} from "./list/announcement-list.component";
import {AnnouncementComponent} from "./announcement/announcement.component";
import {AnnouncementDetailsComponent} from "./announcement/details/announcement-details.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {RoutingModule} from "../routing.module";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {
  AnnouncementDetailsEntryComponent
} from './announcement/details/details-entry/announcement-details-entry.component';
import {FilterTagComponent} from './announcement/filter-tag/filter-tag.component';
import {
  AnnouncementGeneralSearchAutocompleteComponent
} from './search/announcement-general-search-autocomplete.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatInputModule} from "@angular/material/input";
import {MatChipsModule} from "@angular/material/chips";



@NgModule({
  declarations: [
    AnnouncementListComponent,
    AnnouncementComponent,
    AnnouncementDetailsComponent,
    AnnouncementDetailsEntryComponent,
    FilterTagComponent,
    AnnouncementGeneralSearchAutocompleteComponent,
    
  ],
  imports: [
    MatProgressSpinnerModule,
    RoutingModule,
    CommonModule,
    NgOptimizedImage,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    FormsModule,
    MatInputModule,
    AsyncPipe,
    MatChipsModule
  ],
  exports: [
    AnnouncementGeneralSearchAutocompleteComponent,
    AnnouncementListComponent
  ],
  providers: [
    MatDialog
  ]
})
export class AnnouncementsModule {
}
