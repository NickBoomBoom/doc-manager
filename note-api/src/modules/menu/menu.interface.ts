export enum KEY {
  CATEGORY = 'category',
  NOTE = 'note',
}

export interface MenuItem {
  isCategory: boolean;
  isNote: boolean;
  menuId: number;
  targetId: number;
  children?: MenuItem[];
  data:
    | {
        name: string;
        parentId: number;
      }
    | {
        title: string;
        tags: string;
        categoryId: number;
        shareCode: string;
      };
}

export type MenuList = MenuItem[];
