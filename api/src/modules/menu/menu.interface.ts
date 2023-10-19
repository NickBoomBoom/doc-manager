export enum KEY {
  CATEGORY = 'space',
  NOTE = 'doc',
}

export interface MenuItem {
  isSpace: boolean;
  isDoc: boolean;
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
        isLocked: boolean;
        spaceId: number;
        shareCode: string;
      };
}

export type MenuList = MenuItem[];
