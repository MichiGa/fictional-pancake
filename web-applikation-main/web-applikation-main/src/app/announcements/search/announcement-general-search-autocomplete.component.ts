import {Component, ElementRef, ViewChild} from '@angular/core';
import {
  AnnouncementFilterService,
  FILTER_OPTION_HIERARCHIC_KEYS,
  FILTER_OPTION_KEYS
} from "../filter/announcement-filter.service";
import {FormControl} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {FilterOptionNode} from "../filter/multiselect-tree/multiselect-tree";
import {Announcement} from "../announcements";
import {Router} from "@angular/router";

export interface FilterOptionGroup {
  name: string;
  queryParamKey: string;
  pairs: Pair[];
}

export interface Pair {
  id: number;
  value: string;
}

@Component({
  selector: 'app-announcement-general-search-autocomplete',
  templateUrl: './announcement-general-search-autocomplete.component.html',
  styleUrls: ['./announcement-general-search-autocomplete.component.css']
})
export class AnnouncementGeneralSearchAutocompleteComponent {
  @ViewChild('filterOptionGroupInput') filterOptionGroupInput!: ElementRef<HTMLInputElement>;
  filterOptionFormControl = new FormControl('');
  unselectedFilterOptionGroups: FilterOptionGroup[] = [];
  selectedFilterOptions: FilterOptionNode[] = [];
  filteredOptionGroups$ = new BehaviorSubject<FilterOptionGroup[]>([]);

  private wasOnceChangedInputValue = false;
  private announcements: Announcement[] = [];

  constructor(private readonly announcementFilterService: AnnouncementFilterService,
              private readonly router: Router) {

    this.filterOptionFormControl.valueChanges.subscribe(input => {
      if (input) {
        const nextFilterOptionGroups: FilterOptionGroup[] = [];

        if (input.length > 3) {
          const filterAnnouncementOptions: FilterOptionGroup = this.filterAnnouncementFilterOptionGroup(input);
          if (filterAnnouncementOptions.pairs.length > 0)
            nextFilterOptionGroups.push(filterAnnouncementOptions);
        }
        this.wasOnceChangedInputValue = true;
        nextFilterOptionGroups.push(...this.filterOptionGroups(input));
        this.filteredOptionGroups$.next(nextFilterOptionGroups);

      } else
        this.filteredOptionGroups$.next([]);
    });

    FILTER_OPTION_HIERARCHIC_KEYS.concat(FILTER_OPTION_KEYS).forEach((queryParamKey, index) => {
      this.announcementFilterService.getFilterOptions$(queryParamKey).subscribe(filterOptions => {

        this.selectedFilterOptions = this.selectedFilterOptions
          .filter(selectedOption => selectedOption.queryParamKey !== queryParamKey
            || filterOptions.find(option => option === selectedOption && option.isSelected));

        this.selectedFilterOptions.push(...filterOptions.filter(option => option.isSelected && !this.selectedFilterOptions.includes(option)));

        if (index < this.unselectedFilterOptionGroups.length)
          this.unselectedFilterOptionGroups[index].pairs = filterOptions.filter(filterOption => !filterOption.isSelected).map(filterOption => ({
            id: -1,
            value: filterOption.value
          }));
        else {
          this.unselectedFilterOptionGroups.push({
            name: this.getGroupNameFromQueryParamKey(queryParamKey),
            queryParamKey: queryParamKey,
            pairs: filterOptions.filter(filterOption => !filterOption.isSelected).map(filterOption => ({
              id: -1,
              value: filterOption.value
            }))
          } as FilterOptionGroup);
        }

        if (this.wasOnceChangedInputValue)
          this.filteredOptionGroups$.next(this.unselectedFilterOptionGroups.filter(filterOptionGroup => filterOptionGroup.pairs.length > 0));
      });
    });

    this.announcementFilterService.filteredAnnouncements$.subscribe(announcements => this.announcements = announcements);
  }

  selected(pair: Pair, groupName: string) {
    if (pair.id === -1)
      this.announcementFilterService.toggleFilterOption(this.getQueryParamKeyFromGroupName(groupName), pair.value);
    else
      this.router.navigate([pair.id], {queryParamsHandling: "preserve"});

    this.filterOptionGroupInput.nativeElement.value = '';
    this.filterOptionFormControl.setValue(null);
  }

  remove(option: FilterOptionNode) {
    this.announcementFilterService.toggleFilterOption(option.queryParamKey, option.value);
  }

  private filterAnnouncementFilterOptionGroup(input: string): FilterOptionGroup {
    const announcementFilterOptionGroup: FilterOptionGroup = {
      name: 'Themen für Studentische Arbeiten',
      queryParamKey: '',
      pairs: []
    } as FilterOptionGroup;
    this.announcements.forEach(announcement => {
      const value = this.announcementIncludesInputValue(input, announcement);
      if (value) {
        announcementFilterOptionGroup.pairs.push({id: announcement.id, value: value});
      }
    });

    return announcementFilterOptionGroup;
  }

  private announcementIncludesInputValue(input: string, announcement: Announcement): string {
    const inputLowerCase = input.toLowerCase();
    const announcementTitleLowerCase = announcement.title.toLowerCase();
    const announcementDescriptionLowerCase = announcement.description.toLowerCase();

    let value = '';
    const announcementTitleIncludesValue = announcementTitleLowerCase.includes(inputLowerCase);
    const announcementDescriptionIncludesValue = announcementDescriptionLowerCase.includes(inputLowerCase);

    if (announcementTitleIncludesValue || announcementDescriptionIncludesValue) {
      value += announcement.title;

      if (announcementDescriptionIncludesValue) {
        const announcementDescriptionValueIndex = announcementDescriptionLowerCase.indexOf(inputLowerCase);

        if (announcementDescriptionValueIndex !== -1) {
          value += ' (' + this.extractRangeFromIndexFromString(announcement.description, announcementDescriptionValueIndex) + ')';
        }
      }
    }

    return value;
  }

  private extractRangeFromIndexFromString(s: string, index: number): string {
    let range = '';

    let leftPointer = index;
    let rightPointer = index;
    let wordCountLeft = 0;
    let wordCountRight = 0;

    while ((leftPointer >= 0 && wordCountLeft < 4) || (rightPointer < s.length && wordCountRight < 4)) {
      if (leftPointer === rightPointer)
        range += s.charAt(leftPointer);
      else {
        if (leftPointer >= 0 && wordCountLeft < 4) {
          const charAtLeftPointer = s.charAt(leftPointer);
          range = charAtLeftPointer + range;

          if (charAtLeftPointer === ' ')
            wordCountLeft++;
        }
        if (rightPointer < s.length && wordCountRight < 4) {
          const charAtRightPointer = s.charAt(rightPointer);
          range += s.charAt(rightPointer);

          if (charAtRightPointer === ' ')
            wordCountRight++;
        }
      }

      leftPointer--;
      rightPointer++;
    }

    return ('... ' + range + ' ...').replace(/<[^>]*>?/gm, '');
  }

  private filterOptionGroups(input: string): FilterOptionGroup[] {
    return this.unselectedFilterOptionGroups.map(filterOptionGroup => ({
      name: filterOptionGroup.name,
      queryParamKey: filterOptionGroup.queryParamKey,
      pairs: this.filterValues(input, filterOptionGroup.pairs)
    } as FilterOptionGroup)).filter(filterOptionGroup => filterOptionGroup.pairs.length > 0);
  }

  private filterValues(input: string, pairs: Pair[]): Pair[] {
    const filterValue = input.toLowerCase();
    return pairs.filter(pair => pair.value.toLowerCase().includes(filterValue));
  }

  private getGroupNameFromQueryParamKey(queryParamKey: string) {
    switch (queryParamKey) {
      case ('faculty') :
        return 'Fakultät';
      case ('institute') :
        return 'Institut';
      case ('professorship') :
        return 'Professur';
      case ('state') :
        return 'Status';
      case ('types') :
        return 'Art der Arbeit';
      case ('keywords') :
        return 'Stichwörter';
      case ('advisor') :
        return 'Betreuende Person';
    }
    return '';
  }

  private getQueryParamKeyFromGroupName(groupName: string) {
    switch (groupName) {
      case ('Fakultät') :
        return 'faculty';
      case ('Institut') :
        return 'institute';
      case ('Professur') :
        return 'professorship';
      case ('Status') :
        return 'state';
      case ('Art der Arbeit') :
        return 'types';
      case ('Stichwörter') :
        return 'keywords';
      case ('Betreuende Person') :
        return 'advisor';
    }
    return '';
  }
}
