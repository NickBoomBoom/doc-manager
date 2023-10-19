export enum KEY {
  CATEGORY = 'space',
  NOTE = 'note',
}

export interface MenuItem {
  isSpace: boolean;
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
        isLocked: boolean;
        spaceId: number;
        shareCode: string;
      };
}

export type MenuList = MenuItem[];
