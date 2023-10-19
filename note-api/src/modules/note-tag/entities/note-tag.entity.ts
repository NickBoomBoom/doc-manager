import { Base } from '../../../common/entity/base.entity';
import { Note } from '../../../modules/note/entities/note.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity({ name: 'm_note_tag' })
export abstract class NoteTag extends Base {
  @Column({})
  tagIds: string;

  @OneToOne(() => Note, (note) => note.id)
  note: Note;

  @Column()
  noteId: number;

  @Column()
  userId: number;
}
