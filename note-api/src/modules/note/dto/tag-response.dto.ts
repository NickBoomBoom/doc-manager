import { Note } from '../entities/note.entity';

export class TagsResponseDTO {
  [key: string]: Note[];
}
