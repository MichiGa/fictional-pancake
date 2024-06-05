export interface FilterOptionNode {
  value: string
  parent?: FilterOptionNode
  children: FilterOptionNode[]
  queryParamKey: string
  isSelected: boolean
  isPartiallySelected: boolean
}

export interface FilterOptionNodeFlat {
  value: string
  level: number
  expandable: boolean
  queryParamKey: string
  isSelected: boolean
  isPartiallySelected: boolean
}
