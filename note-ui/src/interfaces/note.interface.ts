export interface Note {
  id?: number;
  title: string;
  tags?: string;
  content: string;
  spaceId: number | null;
}
