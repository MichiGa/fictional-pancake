import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AnnouncementsFilterComponent} from "./announcements-filter.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatInputModule} from "@angular/material/input";
import {MatChipsModule} from "@angular/material/chips";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTreeModule} from "@angular/material/tree";
import {MatSelectModule} from "@angular/material/select";
import {MultiselectTreeComponent} from "./multiselect-tree/multiselect-tree.component";
import {MultiselectAutocompleteComponent} from "./multiselect-autocomplete/multiselect-autocomplete.component";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";


@NgModule({
  declarations: [
    AnnouncementsFilterComponent,
    MultiselectTreeComponent,
    MultiselectAutocompleteComponent
  ],
  imports: [
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatChipsModule,
    MatCheckboxModule,
    MatTreeModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule
  ],
  exports: [
    AnnouncementsFilterComponent
  ]
})
export class AnnouncementsFilterModule {
}
