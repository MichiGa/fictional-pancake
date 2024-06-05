import {Component, ViewChild} from "@angular/core";
import {MatTree, MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {FlatTreeControl} from "@angular/cdk/tree";
import {FilterOptionNode, FilterOptionNodeFlat} from "./multiselect-tree";
import {AnnouncementFilterService, FILTER_OPTION_HIERARCHIC_KEYS} from "../announcement-filter.service";

@Component({
  selector: 'app-multiselect-tree',
  templateUrl: './multiselect-tree.component.html',
  styleUrls: ['./multiselect-tree.component.css']
})
export class MultiselectTreeComponent {
  @ViewChild('tree') tree!: MatTree<FilterOptionNode, FilterOptionNodeFlat>;
  flatNodeMap = new Map<FilterOptionNodeFlat, FilterOptionNode>();
  nestedNodeMap = new Map<FilterOptionNode, FilterOptionNodeFlat>();
  treeFlattener: MatTreeFlattener<FilterOptionNode, FilterOptionNodeFlat>;
  treeControl: FlatTreeControl<FilterOptionNodeFlat>;
  dataSource!: MatTreeFlatDataSource<FilterOptionNode, FilterOptionNodeFlat>;

  constructor(private readonly announcementFilterService: AnnouncementFilterService) {

    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren)
    this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.announcementFilterService.getFilterOptions$(FILTER_OPTION_HIERARCHIC_KEYS[0]).subscribe(filterOptions =>
      this.dataSource.data = filterOptions
    );
  }

  getLevel = (node: FilterOptionNodeFlat) => node.level;

  isExpandable = (node: FilterOptionNodeFlat) => node.expandable;

  getChildren = (node: FilterOptionNode): FilterOptionNode[] => node.children;

  hasChild = (_: number, _nodeData: FilterOptionNodeFlat) => _nodeData.expandable;

  transformer = (node: FilterOptionNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.value === node.value ? existingNode : {} as FilterOptionNodeFlat;
    flatNode.value = node.value;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    flatNode.queryParamKey = node.queryParamKey;
    flatNode.isSelected = node.isSelected;
    flatNode.isPartiallySelected = node.isPartiallySelected;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  leafItemSelectionToggle(node: FilterOptionNodeFlat) {
    this.announcementFilterService.toggleFilterOption(node.queryParamKey, node.value);
  }

  todoItemSelectionToggle(node: FilterOptionNodeFlat) {
    this.announcementFilterService.toggleFilterOption(node.queryParamKey, node.value);
  }
}
