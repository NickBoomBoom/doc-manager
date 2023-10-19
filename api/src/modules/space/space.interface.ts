export interface SpaceNote {
  id: number;
  title: number;
  tags: string;
  isLocked: boolean;
  isNote: boolean;
  shareCode: string;
}

export interface SpaceItem {
  id: number;
  name: string;
  parentId: number | null;
  level: number;
  isSpace: boolean;
  children: (SpaceItem | SpaceNote)[];
}

export type SpaceMenuItem = SpaceNote | SpaceItem;
