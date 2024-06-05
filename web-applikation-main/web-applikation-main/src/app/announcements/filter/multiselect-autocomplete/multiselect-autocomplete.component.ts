import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {FormControl} from "@angular/forms";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {AnnouncementFilterService} from "../announcement-filter.service";

@Component({
  selector: 'app-multiselect-autocomplete',
  templateUrl: './multiselect-autocomplete.component.html',
  styleUrls: ['./multiselect-autocomplete.component.css']
})
export class MultiselectAutocompleteComponent implements OnInit {
  @ViewChild('optionInput') optionInput!: ElementRef<HTMLInputElement>;
  @Input() label!: string;
  @Input() queryParamKey!: string;
  optionControl = new FormControl('');
  options: string[] = [];
  filteredOptions$ = new BehaviorSubject<string[]>([]);
  selectedOptions: string[] = [];

  constructor(private readonly announcementFilterService: AnnouncementFilterService) {

    this.optionControl.valueChanges.subscribe(value => {
      if (value)
        this.filteredOptions$.next(this.filterOptions(value));
      else
        this.filteredOptions$.next(this.unselectedOptions());
    });

  }

  ngOnInit() {
    this.announcementFilterService.getFilterOptions$(this.queryParamKey).subscribe(filterOptions => {
      if (this.options.length === 0)
        this.options = filterOptions.map(filterOption => filterOption.value);

      filterOptions.filter(filterOption => filterOption.isSelected).forEach(filterOption => {
        if (!this.selectedOptions.includes(filterOption.value))
          this.selectedOptions.push(filterOption.value);
      });

      const toBeDeletedOptions: string[] = [];
      this.selectedOptions.forEach(option => {
        const filterOption = filterOptions.find(filterOption => filterOption.value === option);
        if (filterOption && !filterOption.isSelected)
          toBeDeletedOptions.push(option);
      });

      this.selectedOptions = this.selectedOptions.filter(option => !toBeDeletedOptions.includes(option));
      this.filteredOptions$.next(this.unselectedOptions());
    });
  }

  remove(option: string): void {
    const index = this.selectedOptions.indexOf(option);

    if (index >= 0) {
      this.selectedOptions.splice(index, 1);
      this.announcementFilterService.toggleFilterOption(this.queryParamKey, option);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    this.selectedOptions.push(value);
    this.announcementFilterService.toggleFilterOption(this.queryParamKey, value);
    this.optionInput.nativeElement.value = '';
    this.optionControl.setValue(null);
  }

  private filterOptions(value: string): string[] {
    return this.options.filter(option => option.toLowerCase().includes(value.toLowerCase()) && !this.selectedOptions.includes(option));
  }

  private unselectedOptions() {
    return this.options.filter(option => !this.selectedOptions.includes(option));
  }
}
