import { Tag } from './tag.interface';

export interface DocTag {
  docId: number;
  tagIds: string;
}

export interface DocTagItem extends Tag {
  docs: number[];
}
