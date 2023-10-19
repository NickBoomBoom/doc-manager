export interface MenuMove {
  menuId: number;
  prevMenuId: number | null;
  belongId: number;
}

type MenuDoc = {
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
  isDoc: boolean;
  menuId: number;
  targetId: number;
  children?: MenuItem[];
  data: MenuDoc & MenuSpace;
}

export type MenuList = MenuItem[];
