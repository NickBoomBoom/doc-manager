import { User } from '../../user/entities/user.entity';
import { Base } from '../../../common/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 't_menu' })
export abstract class Menu extends Base {
  @Column({
    default: null,
  })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    default: null,
  })
  belongId: number; // 父级categoryId

  @Column({
    default: null,
  })
  prevId: string; // category-{number} note-{number}

  @Column({
    default: null,
  })
  curId: string; // category-{number} note-{number}

  @Column({
    default: null,
  })
  nextId: string; // category-{number} note-{number}
}
