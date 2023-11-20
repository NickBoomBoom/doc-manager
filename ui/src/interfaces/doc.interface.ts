export interface Doc {
  id?: number;
  title?: string;
  tags?: string[];
  content: object | null;
  spaceId: number | null;
  docTagId?: number;
}
