export interface SpaceDoc {
  id: number;
  title: number;
  tags: string;
  isLocked: boolean;
  isDoc: boolean;
  shareCode: string;
}

export interface SpaceItem {
  id: number;
  name: string;
  parentId: number | null;
  level: number;
  isSpace: boolean;
  children: (SpaceItem | SpaceDoc)[];
}

export type SpaceMenuItem = SpaceDoc | SpaceItem;
