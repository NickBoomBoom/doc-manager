export interface MenuMove {
  menuId: number;
  prevMenuId: number | null;
  belongId: number | null;
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

export interface TreeNode {
  label: string;
  id: number;
  icon: string;
  children?: TreeNode[];
  index: string;
  extra: MenuItem;
  lazy: boolean;
}

export interface OpenSpace {
  node: TreeNode;
  state: boolean;
}

export type SpaceSubject = OpenSpace | null;
export type DocSubject = MenuItem | null;
export type SecondDocSubject = MenuItem | null;
