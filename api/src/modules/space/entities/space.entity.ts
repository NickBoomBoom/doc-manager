import { User } from '../../user/entities/user.entity';
import { Base } from '../../../common/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 't_space' })
export abstract class Space extends Base {
  @Column({})
  name: string;

  @Column({
    default: null,
  })
  parentId: number | null;

  @Column({
    default: null,
  })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
