export interface Note {
  id?: number;
  title: string;
  tags?: string[];
  content: object | null;
  spaceId: number | null;
  noteTagId?: number;
}
