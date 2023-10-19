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
  belongId: number; // 父级spaceId

  @Column({
    default: null,
  })
  prevId: string; // space-{number} doc-{number}

  @Column({
    default: null,
  })
  curId: string; // space-{number} doc-{number}

  @Column({
    default: null,
  })
  nextId: string; // space-{number} doc-{number}
}
