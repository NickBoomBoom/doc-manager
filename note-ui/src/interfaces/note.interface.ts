export interface Note {
  id?: number;
  title: string;
  tags?: string;
  content: object;
  spaceId: number | null;
}
