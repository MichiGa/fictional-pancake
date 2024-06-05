import {Injectable} from '@angular/core';
import {BehaviorSubject, filter, map, Observable, take} from "rxjs";
import {Announcement} from "../announcements";
import {AnnouncementsService} from "../announcements.service";
import {ActivatedRoute, ParamMap, Params, Router} from "@angular/router";
import {FilterOptionNode} from "./multiselect-tree/multiselect-tree";
import {HttpParams} from "@angular/common/http";

export const FILTER_OPTION_KEYS = ['state', 'types', 'advisor', 'keywords'];
export const FILTER_OPTION_HIERARCHIC_KEYS = ['faculty', 'institute', 'professorship'];

@Injectable({
  providedIn: 'root'
})
export class AnnouncementFilterService {
  private _filterOptions$ = new BehaviorSubject<FilterOptionNode[]>([]);
  private queryParamMap!: ParamMap;
  private unfilteredAnnouncements: Announcement[] = []
  private _filteredAnnouncements$ = new BehaviorSubject<Announcement[]>([]);
  private isInIFrame = true;

  constructor(private readonly announcementsService: AnnouncementsService,
              private readonly route: ActivatedRoute,
              private readonly router: Router) {

    this.announcementsService.announcements$.pipe(filter((a: Announcement[]) => a.length > 0), take(2)).subscribe(announcements => {
      this.unfilteredAnnouncements = announcements;
      this.initFilterOptions();

      if (this.queryParamMap) {
        this.queryParamMap.keys.forEach(key => {
          this.queryParamMap.get(key)?.split(';').forEach(value => this.toggleFilterOption(key, value, true));
        });
      } else
        this._filteredAnnouncements$.next(this.unfilteredAnnouncements);
    });

    const initialQueryParamsSubscription = this.route.queryParamMap.pipe(filter(queryParamMap => queryParamMap.keys.length > 0))
      .subscribe(queryParamMap => this.queryParamMap = queryParamMap);

    setInterval(() => initialQueryParamsSubscription.unsubscribe(), 1);

    this._filterOptions$.subscribe(filterOptions => this.filterAnnouncements(filterOptions));

    try {
      this.isInIFrame = window.self !== window.top;
    } catch (e) {
    }

  }

  get filteredAnnouncements$() {
    return this._filteredAnnouncements$;
  }

  get filterOptions$() {
    return this._filterOptions$;
  }

  getFilterOptions$(queryParamKey?: string): Observable<FilterOptionNode[]> {
    return this._filterOptions$.pipe(
      map(filterOptions => queryParamKey ? this.getFilterOptionsByKey(filterOptions.slice(), queryParamKey) : filterOptions)
    );
  }

  toggleFilterOption(key: string, value: string, isInitialFilter = false) {
    let filterOptionsDeepCopy = structuredClone(this._filterOptions$.value);
    let filterOptions = this._filterOptions$.value.slice();
    let toggleChildren = false;
    let toggleValue = false;

    while (filterOptions.length > 0) {
      const filterOption = filterOptions.pop();

      if (filterOption) {
        if ((filterOption.queryParamKey === key && filterOption.value === value)) {
          filterOption.isSelected = !filterOption.isSelected;

          if (!toggleChildren) {
            let parentNode = filterOption.parent;

            while (parentNode?.value) {
              let isSelected = true;
              let isPartiallySelected = false;

              parentNode.children.forEach(child => {
                if (child.isSelected)
                  isPartiallySelected = true;
                else
                  isSelected = false;
              });

              parentNode.isSelected = isSelected;
              parentNode.isPartiallySelected = isSelected ? false : isPartiallySelected;

              parentNode = parentNode.parent;
            }

            toggleChildren = true;
            filterOptions = [];
            toggleValue = filterOption.isSelected;
          }
        }

        if (toggleChildren)
          filterOption.isSelected = toggleValue;

        filterOptions.push(...filterOption.children);
      }
    }

    const queryParams = this.updatedQueryParams();

    if (this.isInIFrame && !isInitialFilter && FILTER_OPTION_HIERARCHIC_KEYS.includes(key)) {
      this._filterOptions$.next(filterOptionsDeepCopy);
      window.open('https://webtech.informatik.unibw-muenchen.de/abschlussarbeiten/#/?' + new HttpParams({fromObject: queryParams}).toString());
      return;
    } else {
      this._filterOptions$.next(this._filterOptions$.value);
      this.router.navigate([], {queryParams: queryParams});
    }
  }

  private updatedQueryParams() {
    const queryParams: Params = {};
    const filterOptions = this._filterOptions$.value.slice();

    while (filterOptions.length > 0) {
      const filterOption = filterOptions.pop();

      if (filterOption) {
        if (filterOption.isSelected) {
          const keyValues = queryParams[filterOption.queryParamKey];
          keyValues ? keyValues.push(filterOption.value) : queryParams[filterOption.queryParamKey] = [filterOption.value];

        } else
          filterOptions.push(...filterOption.children);
      }
    }

    for (let queryParamsKey in queryParams) {
      let queryParamsToString = '';
      queryParams[queryParamsKey].forEach((param: string) => queryParamsToString += param.toString() + ';')
      queryParams[queryParamsKey] = queryParamsToString;
    }

    return queryParams;
  }

  private initFilterOptions() {
    const filterOptions: FilterOptionNode[] = this.initHierarchicFilterOptions();

    FILTER_OPTION_KEYS.forEach(key => {
      this.unfilteredAnnouncements.forEach(announcement => {
        const keyValues: string[] = Array.isArray(announcement[key]) ? announcement[key] : [announcement[key]];

        keyValues.forEach(value => {
          if (!filterOptions.find(option => option.queryParamKey === key && option.value === value))
            filterOptions.push({
              queryParamKey: key,
              value: value,
              children: [],
              isSelected: false,
              isPartiallySelected: false
            } as FilterOptionNode)
        });

      });
    });

    this._filterOptions$.next(filterOptions);
  }

  private initHierarchicFilterOptions() {
    const hierarchicFilterOptions: FilterOptionNode[] = [];

    this.unfilteredAnnouncements.slice().sort((a, b) => a.institute.localeCompare(b.institute)).forEach(announcement => {
      let node = this.createHierarchicOptionNodeFromAnnouncement(announcement);
      let dummyNode = {
        value: "",
        children: hierarchicFilterOptions,
        queryParamKey: "",
        isSelected: false,
        isPartiallySelected: false
      };

      while (dummyNode.children && node) {
        const dummyChild = dummyNode.children.find(child => child.value === node.value);
        if (!dummyChild) {
          dummyNode.children.push(node);
          node.parent = dummyNode;
          break;
        }

        node = node.children[0];
        dummyNode = dummyChild;
      }
    });

    return hierarchicFilterOptions;
  }

  private createHierarchicOptionNodeFromAnnouncement(announcement: Announcement): FilterOptionNode {
    const facultyNode: FilterOptionNode = {
      value: announcement[FILTER_OPTION_HIERARCHIC_KEYS[0]],
      queryParamKey: FILTER_OPTION_HIERARCHIC_KEYS[0],
      isSelected: false,
      children: [],
      isPartiallySelected: false
    }

    const instituteNode: FilterOptionNode = {
      value: announcement[FILTER_OPTION_HIERARCHIC_KEYS[1]],
      queryParamKey: FILTER_OPTION_HIERARCHIC_KEYS[1],
      isSelected: false,
      children: [],
      parent: facultyNode,
      isPartiallySelected: false
    }

    const professorshipNode: FilterOptionNode = {
      value: announcement[FILTER_OPTION_HIERARCHIC_KEYS[2]],
      queryParamKey: FILTER_OPTION_HIERARCHIC_KEYS[2],
      isSelected: false,
      children: [],
      parent: instituteNode,
      isPartiallySelected: false
    }

    facultyNode.children.push(instituteNode);
    instituteNode.children.push(professorshipNode);

    return facultyNode;
  }

  private getFilterOptionsByKey(filterOptions: FilterOptionNode[], queryParamKey: string): FilterOptionNode[] {
    const filterOptionsByKey: FilterOptionNode[] = [];

    while (filterOptions.length > 0) {
      const filterOption = filterOptions.pop();

      if (filterOption) {
        if (filterOption.queryParamKey === queryParamKey)
          filterOptionsByKey.push(filterOption);

        filterOptions.push(...filterOption.children);
      }
    }
    return filterOptionsByKey;
  }

  private filterAnnouncements(filterOptions: FilterOptionNode[]) {
    const unfilteredAnnouncements = this._filteredAnnouncements$.value.slice();
    unfilteredAnnouncements.push(
      ...this.unfilteredAnnouncements.filter(announcement => !unfilteredAnnouncements.includes(announcement))
    );

    const filteredAnnouncements: Announcement[] = [];

    unfilteredAnnouncements.forEach(announcement => {
      const filterMap = new Map<string, boolean[]>();

      filterOptions.forEach(filterOption => {
        if (!filterMap.has(filterOption.queryParamKey))
          filterMap.set(filterOption.queryParamKey, [false, false]);

        const queue = [filterOption];

        while (queue.length > 0) {
          const curOption = queue.pop();

          if (curOption) {
            if (curOption.isSelected) {
              const announcementKeyValue = announcement[curOption.queryParamKey];
              const announcementKeyValueToArray: string[] = Array.isArray(announcementKeyValue) ? announcementKeyValue : [announcementKeyValue];

              const filterMapKeyValue = filterMap.get(this.getFilterOptionRootQueryParamKey(curOption));

              if (filterMapKeyValue && filterMapKeyValue.length === 2) {
                filterMapKeyValue[1] = true;

                if (announcementKeyValueToArray.includes(curOption.value))
                  filterMapKeyValue[0] = true;
              }
            }

            queue.push(...curOption.children);
          }
        }
      });

      let isPassingFilter = true;
      filterMap.forEach((value) => {
        if (value.length === 2 && !value[0] && value[1])
          isPassingFilter = false;
      });

      if (isPassingFilter)
        filteredAnnouncements.push(announcement);

    });

    this._filteredAnnouncements$.next(filteredAnnouncements);
  }

  private getFilterOptionRootQueryParamKey(filterOption: FilterOptionNode): string {
    let root = filterOption;

    while (root.parent && root.parent.value)
      root = root.parent;

    return root.queryParamKey;
  }

}
