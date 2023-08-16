import { Base } from 'src/common/entity/base.entity';
import { Column, Entity, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { Note } from '../../note/entities/note.entity';
import { User } from 'src/modules/user/entities/user.entity';
@Entity({ name: 't_category' })
export abstract class Category extends Base {
  @Column({})
  name: string;

  @Column({
    default: null,
  })
  parentId: number | null;

  @Column({
    default: 0,
  })
  level: number;

  @OneToMany(() => Note, (note) => note.category)
  notes: Note[];

  @ManyToOne(() => User)
  @JoinTable({ name: 'userId' })
  user: User;
}
