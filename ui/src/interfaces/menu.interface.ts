export interface MenuMove {
  menuId: number;
  prevMenuId: number | null;
  belongId: number;
}

type MenuNote = {
  title: string;
  isLocked: boolean;
  spaceId: number;
  shareCode: string;
};

type MenuSpace = {
  name: string;
  parentId: number;
};
export interface MenuItem {
  isSpace: boolean;
  isNote: boolean;
  menuId: number;
  targetId: number;
  children?: MenuItem[];
  data: MenuNote & MenuSpace;
}

export type MenuList = MenuItem[];
