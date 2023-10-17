import { Base } from 'src/common/entity/base.entity';
import { NoteTag } from 'src/modules/note-tag/entities/note-tag.entity';
import { Space } from 'src/modules/space/entities/space.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
@Entity({ name: 't_note' })
export abstract class Note extends Base {
  @Column()
  title: string;

  @Column('json')
  content: object;

  @Column({
    default: false,
  })
  isLocked: boolean;

  @Column({
    unique: true,
  })
  shareCode: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({})
  userId: number;

  @ManyToOne(() => Space)
  @JoinColumn({ name: 'spaceId' })
  space: Space;

  @Column({})
  spaceId: number;

  @OneToOne(() => NoteTag, (noteTag) => noteTag.tagIds)
  noteTag: NoteTag;

  @Column()
  noteTagId: number;
}
