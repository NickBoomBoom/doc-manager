import { Tag } from './tag.interface';

export interface NoteTag {
  noteId: number;
  tagIds: string;
}

export interface NoteTagItem extends Tag {
  notes: number[];
}
