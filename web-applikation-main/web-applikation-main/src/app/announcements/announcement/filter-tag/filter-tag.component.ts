import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {AnnouncementFilterService} from "../../filter/announcement-filter.service";

@Component({
  selector: 'app-filter-tag',
  templateUrl: './filter-tag.component.html',
  styleUrls: ['./filter-tag.component.css']
})
export class FilterTagComponent implements OnChanges {
  @Input() tagName!: string;
  @Input() queryParamKey!: string;
  isSelected: boolean = false;

  constructor(private readonly announcementFilterService: AnnouncementFilterService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.announcementFilterService.getFilterOptions$(this.queryParamKey).subscribe(filterOptions => {
      this.isSelected = !!filterOptions.find(option => option.value === this.tagName && option.isSelected)
    });
  }

  onClickTag() {
    this.announcementFilterService.toggleFilterOption(this.queryParamKey, this.tagName);
  }
}
