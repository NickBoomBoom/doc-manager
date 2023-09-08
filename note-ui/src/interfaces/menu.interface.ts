export interface MenuMove {
  menuId: number;
  prevMenuId: number | null;
  belongId: number;
}

type MenuNote = {
  title: string;
  tags: string;
  isLocked: boolean;
  categoryId: number;
  shareCode: string;
};

type MenuCategory = {
  name: string;
  parentId: number;
};
export interface MenuItem {
  isCategory: boolean;
  isNote: boolean;
  menuId: number;
  targetId: number;
  children?: MenuItem[];
  data: MenuNote | MenuCategory;
}

export type MenuList = MenuItem[];
