export interface CategoryNote {
  id: number;
  title: number;
  tags: string;
  isLocked: boolean;
  isNote: boolean;
  shareCode: string;
}

export interface CategoryItem {
  id: number;
  name: string;
  parentId: number | null;
  level: number;
  isCategory: boolean;
  children: (CategoryItem | CategoryNote)[];
}

export type CategoryMenuItem = CategoryNote | CategoryItem;
